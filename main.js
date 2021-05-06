const https = require("https");
const fs = require("fs");
const express = require("express");
const app = express();
const port = 7077;
const { Server } = require("socket.io");


const httpsOptions = {
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.pem')
};

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
