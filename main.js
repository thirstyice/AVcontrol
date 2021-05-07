const https = require("https");
const fs = require("fs");
const express = require("express");
const app = express();
const port = 7077;
const { Server } = require("socket.io");
const velour = require("./modules/velour.js")
const blackouts = require("./modules/blackouts")

var airWallIsDown = 0;

const southiPadip = "192.168.100.253";
const northiPadip = "192.168.100.254";


const httpsOptions = {
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.pem')
};

function iPadRedirect(req, res, next) {
	if (req.ip === northiPadip) {
		res.redirect("/pages-north");
	} else if (req.ip === southiPadip) {
		res.redirect("/pages-south");
	} else {
		next()
	}
}

app.use("/pages", iPadRedirect);

app.use("/", express.static("public"));

var server = https.createServer(httpsOptions, app);
const io = new Server(server);

io.on('connection', (socket) => {
	console.log("User connected on socket " + socket);

	socket.on("set-system-info", () => {
		var info = {
			version:require("./package.json").version,
			clients: io.sockets.sockets.size
		}
		io.emit("set-system-info", info);
	});

	socket.on("moveDrape", (drape) => {
		if (drape.type == "velour") {
			if (drape.id == "walls") {
				if (socket.address != southiPadip || airWallIsDown == 0) {
					velour[drape.direction](1);
					velour[drape.direction](2);
				}
				if (socket.address != northiPadip || airWallIsDown == 0) {
					velour[drape.direction](3);
					velour[drape.direction](4);
				}
			} else if (drape.id == "windows") {
				if (socket.address != southiPadip || airWallIsDown == 0) {
					velour[drape.direction](9);
					velour[drape.direction](10);
				}
				if (socket.address != northiPadip || airWallIsDown == 0) {
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
				if (socket.address != northiPadip || airWallIsDown == 0) {
					blackouts[drape.direction](1);
				}
			} else if (drape.id == "windows") {
				if (socket.address != southiPadip || airWallIsDown == 0) {
					blackouts[drape.direction](8);
					blackouts[drape.direction](9);
					blackouts[drape.direction](10);
					blackouts[drape.direction](11);
					blackouts[drape.direction](12);
				}
				if (socket.address != northiPadip || airWallIsDown == 0) {
					blackouts[drape.direction](2);
					blackouts[drape.direction](3);
					blackouts[drape.direction](4);
					blackouts[drape.direction](5);
					blackouts[drape.direction](6);
					blackouts[drape.direction](7);
				}
			} else {
				blackouts[drape.direction](drape.id);
			}
		}
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
