const socket = io();

socket.on("audioSlider", (sliderValues) => {
	console.log(sliderValues);
	if (!sliderValues) {
		var tr = document.getElementById("audioControls").
			appendChild(document.createElement("td")).
			appendChild(document.createElement("table")).
			appendChild(document.createElement("table")).
			appendChild(document.createElement("tbody")).
			appendChild(document.createElement("tr"));

		var slider = tr.
			appendChild(document.createElement("td")).
			appendChild(document.createElement("input"));
			slider.parentElement.id = "sliderContainer";
		slider.setAttribute("type", "range");
		slider.setAttribute("min", "0");
		slider.setAttribute("max", "64");
		slider.id = "audioSlider";
		slider.setAttribute("onchange", "socket.emit('setAudioLevel', this.value)");

		var muteButton = tr.
			appendChild(document.createElement("td")).
			appendChild(document.createElement("button"));
		muteButton.setAttribute("onclick", "socket.emit('toggleMute')");
		muteButton.id = "muteButton";
		muteButton.innerText = "Mute";

		document.getElementById("audioControls").style.height = "70px";
	} else {
		if (typeof sliderValues.level != "undefined") {
			var slider = document.getElementById("audioSlider")
			if (slider !=null) {
				slider.setAttribute("value", sliderValues.level);
				// Dumb hack to get the updated value to draw by forcing redraw of slider
				document.getElementById("sliderContainer").style.display = "none";
				document.getElementById("sliderContainer").style.display = "table-cell";
			}
		}
		if (typeof sliderValues.muted != "undefined") {
			var muteButton = document.getElementById("muteButton")
			if (muteButton !=null) {
				muteButton.setAttribute("class", sliderValues.muted ? "muted" : "");
				muteButton.innerText = sliderValues.muted ? "Muted" : "Mute";
				var slider = document.getElementById("audioSlider")
				if (slider !=null) {
					slider.setAttribute("class", sliderValues.muted ? "disabled" : "");
				}
			}
		}
	}
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
function projector() {
	// TODO:
}
