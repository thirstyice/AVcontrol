const socket = io();

socket.on("disconnect", (reason) => {
	console.log("Socket disconnected: " + reason);
});

function makeTableBody(array, action) {
	var tbody = document.createElement("tbody");
	if (array==null) {
		return tbody;
	}
	for (var row of array) {
		var tr = tbody.appendChild(document.createElement("tr"));
		for (var cell of row) {
			var td = tr.appendChild(document.createElement("td"));
			if ( cell != "") {
				td.innerText = cell;
				td.setAttribute("onclick", action + "(this)");
				td.setAttribute("class", "button " + cell.replace(/[-]/g, ""));
			}
		}
	}
	return tbody;
}

window.onload = function() {
	socket.emit("getDrapeConfiguration", "basicDrapes", (config) => {
		var tbody = makeTableBody(config.table, "drapeControl");
		for (table of document.getElementsByClassName("drapeTable")) {
			table.appendChild(tbody);
		}
	})
}

function drapeControl(caller) {
	var column = Array.prototype.indexOf.call(caller.parentElement.children, caller);
	var heading = caller.parentElement.parentElement.children[0].children[column].innerText;
	var drapeType = heading.replace(/[-]/g,"").replace(/North |South /g, "").toLowerCase();

	if (caller.innerText == "Advanced") {
		window.location.href = '/pages/advancedDrapes.html?drapeType=' + drapeType;
		return;
	}
	var space = heading.match(/North |South /);
	space = space ? space : "";
	var drape = {
		type: drapeType,
		id: space + caller.innerText.replace(/Open|Close/g, "").trim(),
		direction: caller.innerText.match(/Open|Close/)[0]
	};
	socket.emit("moveDrape", drape);
}
