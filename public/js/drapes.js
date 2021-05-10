const socket = io();

socket.on("disconnect", (reason) => {
	console.log("Socket disconnected: " + reason);
});

window.onload = function() {
	headings = document.getElementById("headings").children;
	for (var i=0; i < headings.length; i++) {
		heading = headings.item(i);
		["Open", "Close"].forEach((direction) => {
			var node = document.createElement("td");
			node.setAttribute("onclick", "clicked('" + heading.id + "','" + direction + "')");
			node.setAttribute("class", "button " + direction);
			node.innerText = direction;
			document.getElementById(direction).appendChild(node);
		});
		if (heading.id == "louvres") {
			["Tilt Open", "Tilt Close"].forEach((direction) => {
				var node = document.createElement("td");
				node.setAttribute("onclick", "clicked('" + heading.id + "','" + direction + "')");
				node.setAttribute("class", "button " + direction);
				node.innerText = direction;
				document.getElementById(direction.replace(/^.* /, "")).appendChild(node);
			});
		}
	}
}

function clicked(heading, direction) {
	var drape = {
		type: "",
		id: "",
		direction: direction.toLowerCase().replace(/ /, "")
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
		case "louvres":
			drape.type = "louvres";
			drape.id = "all";
		break;
		default:
			console.error("Unknown blind");
			return;
	}
	socket.emit("moveDrape", drape);
}
