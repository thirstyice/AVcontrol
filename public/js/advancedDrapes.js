const socket = io("/drapes");
socket.on("error", (error) => {
	alert("Warning: " + error);
});

var url = new URL(window.location)
var drapeType;
if (url.searchParams.has("drapeType")) {
	drapeType = url.searchParams.get("drapeType");
}	else {
	drapeType = "velour";
}
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
				td.setAttribute("class", "button " + cell);
			}
		}
	}
	return tbody;
}

window.onload = function() {
	socket.emit("getDrapeConfiguration", drapeType, (config) => {
		var tbody = makeTableBody(config.table, "drape");
		 var header = document.getElementById("header")
		header.innerText = config.header;
		document.getElementById("drapeTable").appendChild(tbody);
	})
}
function drape(command) {
	var id = command.replace(/^.* /, "");
	var drape = {
		type: drapeType,
		id: id,
		direction: command.replace(id, "")
	};
	socket.emit("moveDrape", drape);
}
