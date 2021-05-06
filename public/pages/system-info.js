const socket = io();

socket.on("disconnect", (reason) => {
	console.log("Socket disconnected: " + reason);
});

function setInfo(id, info) {
	var node = document.getElementById(id).appendChild(document.createElement("td"));
	node.innerHTML = info;
}

socket.on("set-system-info", (arg) => {
	setInfo("version", arg.version);
	setInfo("clients", arg.clients);
});

window.onload = function () {
		socket.emit("set-system-info");
}
