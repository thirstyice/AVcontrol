const socket = io();

socket.on("audioSlider", (sliderValues) => {
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

socket.on("setMixerValues", (values) => {
	for (device in values) {
		var sliders = document.getElementsByClassName("slider " + device);
		if (typeof values[device].level != "undefined") {
			for (slider of sliders) {
				slider.setAttribute("value", values[device].level);
			}

		}
		var muteButtons = document.getElementsByClassName("button " + device);
		if (typeof values[device].muted != "undefined") {
			for (muteButton of muteButtons) {
				if (values[device].muted) {
					muteButton.classList.add("muted")
				} else {
					muteButton.classList.remove("muted");
			}
		}
	}
	// Dumb hack to get the updated values to draw by forcing redraw of slider
	for (sliderContainer of document.getElementsByClassName("sliderContainer")){
		sliderContainer.style.display = "none";
		sliderContainer.style.display = "table-cell";
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
			slider.setAttribute("min", "-70");
			slider.setAttribute("max", "6");
			slider.setAttribute("onchange", "changeLevel('" + cell + "')");
			slider.setAttribute("class", "slider " + cell.replace(/[-]/g, ""));
			muteButton.innerText = "Mute";
			muteButton.setAttribute("onclick", "mute('" + cell + "')");
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
	socket.emit("mixerToggleMute", device);
}
function changeLevel(device) {
	var level = {
		device: device,
		level: this.value,
	}
	socket.emit("mixerChangeLevel", level);
}
