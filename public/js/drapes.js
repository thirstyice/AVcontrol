const socket = io();

socket.on("disconnect", (reason) => {
	console.log("Socket disconnected: " + reason);
});

window.onload = function() {
	headings = document.getElementById("headings").children;
	for (var i=0; i < headings.length; i++) {
		heading = headings.item(i);
		["Open", "Close"].forEach((direction, j) => {
			var node = document.createElement("td");
			node.setAttribute("onclick", "clicked('" + heading.id + "','" + direction + "')");
			node.setAttribute("class", direction);
			node.innerText = direction;
			document.getElementById(direction).appendChild(node);
		});
	}
}

function clicked(heading, direction) {
	var drape = {
		type: "",
		id: "",
		direction: direction.toLowerCase()
	};
	switch (heading) {
		case "wallDrapes":
			drape.type = "velour";
			drape.id = "walls";
		break;
		case "windowDrapes":
			drape.type = "velour";
			drape.id = "windows";
		break;
		case "blackouts":
			drape.type = "blackouts";
			drape.id = "windows";
		break;
		case "viewingBlind":
			drape.type = "blackouts";
			drape.id = "viewing";
		break;
		default:
		console.error("Unknown blind");
		return;
	}
	socket.emit("moveDrape", drape);
}
