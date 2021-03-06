const logger = require("./modules/logger")
const https = require("https");
const fs = require("fs");
const express = require("express");
const app = express();
const port = 443;
const { Server } = require("socket.io");
const configuration = require("./modules/configuration");
const velour = require("./modules/velour.js");
const blackouts = require("./modules/blackouts");
const paradigm = require("./modules/paradigm");
const extron = require("./modules/extron");
const tesira = require("./modules/tesira");
const screens = require("./modules/screens");
const projector = require("./modules/projector");
const bluRay = require("./modules/bluRay");
const louvres = require("./modules/louvres");

var airWallIsDown = true;

function airWallDidMove(isDown) {
	if (airWallIsDown != isDown) {
		console.info("Airwall moved " + (isDown?"down":"up"));
		airWallIsDown = isDown;
		io.emit("refresh");
	}
}

paradigm.emitter.on("wall", (data) => {
	if (data.includes("Wall Aud1 + Aud2")) {
		if (/open|close/.test(data)) {
			airWallDidMove(data.includes("close"));
		} else {
			console.warn("Main: unknown wall state: " + data);
		}
	} else {
		console.warn("Main: unknown wall: " + data);
	}
});
setTimeout(paradigm.send, 5000, "wall get Wall Aud1 + Aud2");



const southiPadip = "::ffff:192.168.100.253";
const northiPadip = "::ffff:192.168.100.254";


const httpsOptions = {
	key: fs.readFileSync(__dirname + '/key.pem'),
	cert: fs.readFileSync(__dirname + '/cert.pem')
};
function getControlSpace(requestIp) {
	if (airWallIsDown==true) {
		if (requestIp.includes(northiPadip)) {
			return "north";
		} else if (requestIp.includes(southiPadip)) {
			return "south";
		}
		return "split";
	}
	return "combined";
}


app.use("/", express.static(__dirname + "/public"));

var server = https.createServer(httpsOptions, app);
const io = new Server(server);

io.on('connection', (socket) => {
	socket.onAny((event, args) => {
		logger.info("Recieved: " + event + " from: " + socket.handshake.address);
	});
});

//####################
//    DRAPES:
//####################

const drapes = io.of("/drapes");
drapes.on("connection", (socket) => {

	socket.on("getDrapeConfiguration", (drapeType, callback) => {
		var config = {};
		var controlSpace = getControlSpace(socket.handshake.address);
		if (controlSpace == "combined") {
			controlSpace = "";
		} else {
			controlSpace = controlSpace + " ";
		}
		controlSpace = controlSpace.replace(/^\w/, (c) => c.toUpperCase());
		config.header = controlSpace + drapeType.replace(/^\w/, (c) => c.toUpperCase());
		config.table = configuration[drapeType].table[getControlSpace(socket.handshake.address)];
		callback(config);
	});

	socket.on("moveDrape", (drape) => {
		console.info("Moving: " + drape.id + drape.type + drape.direction + ";");
		var controlSpace = getControlSpace(socket.handshake.address)
		var patch = configuration[drape.type]["patch"];
		switch (drape.type) {
			case "louvres":
				if (controlSpace == "split") {
					controlSpace = drape.id.match(/North|South/)[0].toLowerCase();
					drape.id = drape.id.replace(/North |South /, "");
				}
				louvres[drape.id.toLowerCase() + drape.direction.toLowerCase()](patch[controlSpace])
			break;
			case "velour":
				velour[drape.direction.toLowerCase()](patch[controlSpace][drape.id]);
			break;
			case "blackouts":
				blackouts.move(patch[controlSpace][drape.id], drape.direction.toLowerCase());
			break;
			default: logger.error("Unknown Drape Type: " + drape.type);
		}
	});
});

//####################
//    AV:
//####################

const av = io.of("/av");
av.on("connection", (socket) => {

	socket.on("getExtronConfiguration", (callback) => {
		callback(configuration.extron.table.inputs[getControlSpace(socket.handshake.address)]);
	})
	socket.on("getScreenConfiguration", (callback) => {
		callback(configuration.screens.table[getControlSpace(socket.handshake.address)]);
	});
	socket.on("getProjectorConfiguration", (callback) => {
		callback(configuration.projector.table[getControlSpace(socket.handshake.address)]);
	});
	socket.on("getBluRayControlConfiguration", (callback) => {
		callback(configuration.bluRayControl.table[getControlSpace(socket.handshake.address)]);
	});
	socket.on("extron", (info) => {
		extron.setPath(configuration.extron.patch.inputs[info.input], "all", info.media);
	});
	socket.on("screen", (command) => {
		var controlSpace = getControlSpace(socket.handshake.address);
		if (controlSpace == "combined") {
			screens[configuration.screens.patch[command]]();
		} else {
			screens[configuration.screens.patch[
				controlSpace.replace(/^\w/, (c) => c.toUpperCase()) + " " + command
			]]();
		}
	});
	socket.on("projector", (command) => {
		if (command.match(/^Preset/)) {
			projector.setChannel(
				configuration.projector.patch.presets[command.replace(/^Preset /, "")]
			);
		} else if (command.match(/On|Off/)) {
			projector[command.toLowerCase()]();
		} else {
			console.error("Unrecognized command:" + command);
		}
	});
	socket.on("bluRay", (command) => {
		bluRay.sendCommand(configuration.bluRayControl.patch[command]);
	});
});

//####################
//    SYSTEM INFO:
//####################

const systemInfo = io.of("/system-info");
systemInfo.on("connection", (socket) => {

	socket.on("set-system-info", () => {
		var ips = [];
		for (const [key, value] of io.sockets.sockets) {
			if (ips.includes(value.handshake.address) === false) {
				ips.push(value.handshake.address);
			}
		}
		var info = {
			version:require("./package.json").version,
			clients: ips.length,
			airwall_status: airWallIsDown ? "Down" : "Up"
		}

		systemInfo.emit("set-system-info", info);
	});
	socket.on("refreshAirwallStatus", () => {
		paradigm.send("wall get Wall Aud1 + Aud2");
	})
});

//####################
//    MIXER:
//####################

const mixer = io.of("/mixer");
async function updateMixerValues() {
	for ([key, socket] of mixer.sockets) {
		var devices = {};
		controlSpace = getControlSpace(socket.handshake.address);
		for (device of configuration.tesira.table[controlSpace]) {
			devices[device] = {};
			var deviceId = configuration.tesira.patch[controlSpace][device];
			devices[device].level = await tesira.getLevel(deviceId);
			devices[device].muted = await tesira.getMute(deviceId);
		}
		socket.emit("setMixerValues", devices);
	}
}
mixer.on("connection", (socket) => {

	socket.on("getMixerConfiguration", async (callback) => {
		var controlSpace = getControlSpace(socket.handshake.address);
		var devices = {};
		callback(configuration.tesira.table[controlSpace]);
		updateMixerValues().catch((err) => {
			socket.emit("error", err);
		});
	});
	socket.on("mixerToggleMute", (device) => {
		var deviceId = configuration.tesira.patch[getControlSpace(socket.handshake.address)][device];
		tesira.toggleMute(deviceId)
		.then( () => { updateMixerValues() })
		.catch( (err) => {
			socket.emit("error", err);
		});
	});
	socket.on("mixerChangeLevel", (level) => {
		var deviceId = configuration.tesira.patch[getControlSpace(socket.handshake.address)][level.device];
		tesira.setLevel(deviceId, level.level)
		.then( () => { updateMixerValues() })
		.catch( (err) => {
			socket.emit("error", err);
		});
	});
});

//####################
//    LIGHTING:
//####################

const lighting = io.of("/lighting");
lighting.on("connection", (socket) => {

	socket.on("getLightingPresets", (callback) => {
		callback(configuration.paradigm.presets[getControlSpace(socket.handshake.address)]);
	});
	socket.on("activateLightingPreset", (preset) => {
		var controlSpace = getControlSpace(socket.handshake.address);
		var space = "";
		if (controlSpace == "split") {
			space = "Studio " + preset.match(/^South|North/);
			preset = preset.replace(/^South|North /, "");
		} else {
			space = configuration.paradigm.spaces[controlSpace]
		}
		paradigm.activate(preset, space);
	});
})

//####################
//    INDEX:
//####################

const index = io.of("/index");
index.on("connection", (socket) => {
	socket.on("getSystemShutdownConfiguration", (callback) => {
		callback(configuration.systemShutdown.table[getControlSpace(socket.handshake.address)]);
	})
	socket.on("systemShutdown", (command) => {
		console.info("Shutdown: " + command);
		command = command.replace("Shutdown ", "");
		var controlSpace = getControlSpace(socket.handshake.address);
		if (controlSpace == "split") {
			controlSpace = command.match(/North|South/)[0].toLowerCase();
			command = command.replace(/North |South /, "");
		}
		switch (controlSpace) {
			case "north": case "combined":
				projector.off();
				bluRay.sendCommand("POF");
			break;
		}
		if (/Base State/.test(command)) {
			louvres.auto(configuration.louvres.patch[controlSpace]);
			velour.open(configuration.velour.patch[controlSpace].Windows);
			velour.open(configuration.velour.patch[controlSpace].Wall);
			if (controlSpace != "north") {
				screens.raiseSouth();
			}
			if (controlSpace != "south") {
				screens.raiseNorth();
			}
			(async function () {
				for (device in configuration.tesira.patch[controlSpace]) {
					var deviceId = configuration.tesira.patch[controlSpace][device];
					await tesira.setMute(deviceId, true);
					await tesira.setLevel(deviceId, 0);
				}
			})().then(() => {
				updateMixerValues()
			}).catch( (err) => {
				console.error("System shutdown: " + err);
				socket.emit("error", err);
			})
			blackouts.move(configuration.blackouts.patch[controlSpace].all,"open")
		}
		paradigm.deactivate("", configuration.paradigm.spaces[controlSpace]);
	});
});


// Redirect http to https
var http = express();
http.get('*', function(req, res) {
	res.redirect('https://' + req.headers.host + req.url);
})
http.listen(80);

// And serve the server
server.listen(port, () => {
	logger.info(`Server listening on port ${port}`);
});
