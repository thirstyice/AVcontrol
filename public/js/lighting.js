const socket = io();
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
				td.setAttribute("onclick", action + "(this.innerText)");
				td.setAttribute("class", "button " + cell.replace(/[-]/g, ""));
			}
		}
	}
	return tbody;
}
window.onload = function() {
	socket.emit("getLightingPresets", (config) => {
		var tbody = makeTableBody(config, "activatePreset");
		for (table of document.getElementsByClassName("lightingTable")) {
			table.appendChild(tbody);
		}
	});
}
function activatePreset(preset) {
	socket.emit("activateLightingPreset", preset);
}
