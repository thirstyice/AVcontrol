const https = require("https");
const fs = require("fs");
const express = require("express");
const app = express();
const port = 7077;
const { Server } = require("socket.io");
const velour = require("./modules/velour.js");
const blackouts = require("./modules/blackouts");
const paradigm = require("./modules/paradigm");
const extron = require("./modules/extron");

var airWallIsDown = true;

const southiPadip = "::ffff:192.168.100.253";
const northiPadip = "::ffff:192.168.100.254";


const httpsOptions = {
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.pem')
};

function iPadRedirect(req, res, next) {
	if (airWallIsDown == true) {
		if ( ! ( [ // Define pages exempt from redirect
			"lighting.html",
			"system-info.html",
			"drapes.html"
		].includes(req.originalUrl.match("^[^?]*")[0].replace("/pages/", "")))) {
			var originalUrl = req.originalUrl;
			if (req.ip === northiPadip) {
				res.redirect( originalUrl.replace("pages", "pages-north"));
				return;
			} else if (req.ip === southiPadip) {
				res.redirect( originalUrl.replace("pages", "pages-south"));
				return;
			}
		}
	}
	next();
}

app.use("/pages", iPadRedirect);

app.use("/", express.static("public"));

var server = https.createServer(httpsOptions, app);
const io = new Server(server);

io.on('connection', (socket) => {
	socket.onAny((event, args) => {
		console.log("Recieved: " + event);
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

	socket.on("moveDrape", (drape) => {
		if (drape.type == "velour") {
			if (drape.id == "walls") {
				if (socket.handshake.address != southiPadip || airWallIsDown == false) {
					velour[drape.direction](1);
					velour[drape.direction](2);
				}
				if (socket.handshake.address != northiPadip || airWallIsDown == false) {
					velour[drape.direction](3);
					velour[drape.direction](4);
				}
			} else if (drape.id == "windows") {
				if (socket.handshake.address != southiPadip || airWallIsDown == false) {
					velour[drape.direction](9);
					velour[drape.direction](10);
				}
				if (socket.handshake.address != northiPadip || airWallIsDown == false) {
					velour[drape.direction](5);
					velour[drape.direction](6);
					velour[drape.direction](7);
					velour[drape.direction](8);
				}
			} else {
				velour[ drape.direction ](drape.id);
			}
		} else if (drape.type == "blackouts") {
			if (drape.id == "viewing") {
				if (socket.handshake.address != northiPadip || airWallIsDown == false) {
					blackouts.move(0, drape.direction);
				}
			} else if (drape.id == "windows") {
				if (socket.handshake.address == southiPadip && airWallIsDown == true) {
					blackouts.move("south", drape.direction);
				} else if (socket.handshake.address == northiPadip && airWallIsDown == true) {
					blackouts.move("north", drape.direction);
				} else {
					blackouts.move("all", drape.direction);
				}
			} else {
				blackouts.move(drape.id, drape.direction);
			}
		} else if (drape.type = "louvres") {
			// TODO: Handle louvres: open, close, tiltopen, tiltclose
		}
	});
	socket.on("extron", (info) => {
		extron.setPath(info.input, "all", info.media);
	});
	socket.on("screens", (command) => {
		// TODO:
	});
	socket.on("getAudioSlider", () => {
		var path = new URL(socket.request.headers.referer).pathname
		path = path.substr(0, path.lastIndexOf("/"));
		var sliderId = ""
		if (airWallIsDown == false) {
			if (path == "/pages") {
				sliderId = "combined";
			}
		} else {
			switch (path) {
				case "/pages-south": sliderId = "south"; break;
				case "/pages-north": sliderId = "north"; break;
			}
		}
		var audioLevel = 50; // TODO: get the real level
		var muteStatus = false;
		socket.emit("audioSlider", { id:sliderId, level:audioLevel, muteStatus: muteStatus });
	});

	// TODO: Deal with audioSlider and muteButton changes

	socket.on("getLightingPresets", () => {
		var presets;
		if (airWallIsDown == false) {
			presets = { combined: paradigm.getPresets("combined") };
		} else {
			if (socket.handshake.address.includes(northiPadip)) {
				presets = { north: paradigm.getPresets("north") };
			} else if (socket.handshake.address.includes(southiPadip)) {
				presets = { south: paradigm.getPresets("south") };
			} else {
				presets = {
					north: paradigm.getPresets("north"),
					south: paradigm.getPresets("south")
				}
			}
		}
		socket.emit("setLightingPresets", presets);
	});
	socket.on("lightsOff", () => {
		// TODO:
	});
});

// Redirect http to https
var http = express();
http.get('*', function(req, res) {
	res.redirect('https://' + req.headers.host + req.url);
})
http.listen(8080);

// And serve the server
server.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
