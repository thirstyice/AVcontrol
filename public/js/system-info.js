const socket = io();

socket.on("disconnect", (reason) => {
	console.log("Socket disconnected: " + reason);
});
function capFirstLetter(string) {
	return string.replace(/^\w/, (c) => c.toUpperCase());
}

socket.on("set-system-info", (info) => {
	var table = document.getElementById("info");
	for (const [key, value] of Object.entries(info)) {
		var row = document.createElement("tr");
		row.appendChild(document.createElement("td")).innerText = capFirstLetter(`${key}:`).replace(/_/g, ' ');
		row.appendChild(document.createElement("td")).innerText = capFirstLetter(`${value}`).replace(/_/g, ' ');
		table.appendChild(row);
		console.log(`${key}: ${value}`);
	};
});

window.onload = function () {
		socket.emit("set-system-info");
}
