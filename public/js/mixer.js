const socket = io();

socket.on("audioSlider", (sliderValues) => {
	console.log(sliderValues);
	if (!sliderValues) {
		var tr = document.getElementById("audioControls").
			appendChild(document.createElement("td")).
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

function makeTableBody(array) {
	var tbody = document.createElement("tbody");
	if (array==null) {
		return tbody;
	}
	for (var cell of array) {
		var tr = tbody.appendChild(document.createElement("tr"))
		var heading = tr.appendChild(document.createElement("th"));
		var sliderContainer = tr.appendChild(document.createElement("td"));
		sliderContainer.setAttribute("class", "sliderContainer");
		var muteButton = tr.appendChild(document.createElement("td"));

		if ( cell != "") {
			heading.innerText = cell;
			var slider = sliderContainer.appendChild(document.createElement("input"));
			slider.setAttribute("type", "range");
			slider.setAttribute("min", "0");
			slider.setAttribute("max", "100");
			slider.setAttribute("onchange", "changeLevel(this.innerText)");
			slider.setAttribute("class", "slider " + cell.replace(/[-]/g, ""));
			muteButton.innerText = "Mute";
			muteButton.setAttribute("onclick", "mute(this.innerText)");
			muteButton.setAttribute("class", "button " + cell.replace(/[-]/g, ""));
		}
	}
	return tbody;
}

window.onload = function() {
	socket.emit("getMixerConfiguration", (config) => {
		var tbody = makeTableBody(config);
		for (table of document.getElementsByClassName("mixerTable")) {
			table.appendChild(tbody);
		}
	})
}
function mute(device) {
	socket.emit("mixerMute", device);
}
function changeLevel(device) {
	socket.emit("mixerChangeLevel", device);
}
