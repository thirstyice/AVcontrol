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
const screens = require("./modules/screens");

var airWallIsDown = true;
var audioIsMuted = false;

paradigm.addHandler("wall close Wall Aud1 + Aud2, Global", () => {
	airWallIsDown = false;
});
paradigm.addHandler("wall open Wall Aud1 + Aud2, Global", () => {
	airWallIsDown = true;
});
paradigm.send("wall get Wall Aud1 + Aud2");

extron.addHandler(/Amt05\*/, (data) => {
	audioIsMuted = !!data.replace(/Amt05\*/,"").parseInt();
	io.emit("audioSlider", {muted: audioIsMuted});
});
extron.addHandler(/Out05 Vol/, (data) => {
	io.emit("audioSlider", {level:data.replace(/Out05 Vol\*/,"").parseInt()});
})

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

		io.emit("set-system-info", info);
	});

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
		var patch = configuration[drape.type]["patch"][getControlSpace(socket.handshake.address)] ;
		if (drape.type == "louvres") {
			// TODO: louvre control
			return;
		}
		for (key in patch) {
			if (key.includes(drape.id)) {
				switch (drape.type) {
					case "velour":
						velour[drape.direction.toLowerCase()](patch[key]);
					break;
					case "blackouts":
						blackouts.move(patch[key], drape.direction.toLowerCase());
					break;
					default: logger.error("Unknown Drape Type: " + drape.type);
				}
			}
		}
	});
	socket.on("getExtronConfiguration", (callback) => {
		callback(configuration.extron.table.inputs[getControlSpace(socket.handshake.address)]);
	})
	socket.on("getScreenConfiguration", (callback) => {
		callback(configuration.screens.table[getControlSpace(socket.handshake.address)]);
	});
	socket.on("getProjectorConfiguration", (callback) => {
		callback(configuration.projector.table[getControlSpace(socket.handshake.address)]);
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
	socket.on("getAudioSliderValues", () => {
		if (getControlSpace(socket.handshake.address) == "south") {
			return;
		}
		socket.emit("audioSlider");
		extron.requestAudioLevel(5, (audioLevel) => {
			io.emit("audioSlider", {level:audioLevel})
		});
		extron.requestIsMuted(5, (muted) => {
			io.emit("audioSlider", {muted:!!muted});
			audioIsMuted = !!muted;
		})
	});
	socket.on("toggleMute", () => {
		audioIsMuted = !audioIsMuted;
		if (audioIsMuted) {
			extron.muteAudio(5);
		} else {
			extron.unmuteAudio(5);
		}
		io.emit("audioSlider", {muted:audioIsMuted});
	})
	socket.on("setAudioLevel", (level) => {
		extron.setAudioLevel(5, level);
		io.emit("audioSlider", {level: level});
	});

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
	socket.on("lightsOff", () => {
		if (airWallIsDown == true) {
			space = "Global";
		} else {
			if (socket.handshake.address.includes(northiPadip)) {
				space = "Studio North";
			} else if (socket.handshake.address.includes(southiPadip)) {
				space = "Studio South";
			} else {
				space = "Global";
			}
		}
		paradigm.deactivate("", space);
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
