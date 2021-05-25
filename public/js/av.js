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
				td.setAttribute("class", "button " + cell.replace(/[ -]/g, ""));
			}
		}
	}
	return tbody;
}

window.onload = function() {
	socket.emit("getAudioSliderValues");
	socket.emit("getExtronConfiguration", (config) => {
		["video","audio"].forEach((mediaType) => {
			var tbody = makeTableBody(config, mediaType);
			for (table of document.getElementsByClassName(mediaType + "Table")) {
				table.appendChild(tbody);
			}
		})
	})
	socket.emit("getScreenConfiguration", (config) => {
		var tbody = makeTableBody(config, "screen");
		for (table of document.getElementsByClassName("screenTable")) {
			table.appendChild(tbody);
		}
	})
	socket.emit("getProjectorConfiguration", (config) => {
		var tbody = makeTableBody(config, "projector");
		for (table of document.getElementsByClassName("projectorTable")) {
			table.appendChild(tbody);
		}
	});
	socket.emit("getBluRayControlConfiguration", (config) => {
		var tbody = makeTableBody(config, "bluRayControl");
		for (table of document.getElementsByClassName("bluRayControlTable")) {
			table.appendChild(tbody);
		}
	})
}
function audio(source) {
	socket.emit("extron", {media:"audio", input: source});
}
function video(source) {
	socket.emit("extron", {media:"video", input: source});
}
function screen(action) {
	socket.emit("screen", action);
}
function projector(action) {
	if (action == "Blu-Ray Control") {
		console.info("Opening modal: bluRayControlModal");
		document.getElementById("bluRayControlModal").style.display = "block";
	} else {
		socket.emit("projector", action);
	}
}
function bluRayControl(action) {
	socket.emit("bluRay", action);
}
