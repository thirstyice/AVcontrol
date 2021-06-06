const socket = io();

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
			slider.setAttribute("onchange", "changeLevel('" + cell + "', this.value)");
			slider.setAttribute("class", "slider " + cell.replace(/[-]/g, ""));
			muteButton.innerText = "Mute";
			muteButton.setAttribute("onclick", "mute('" + cell + "')");
			muteButton.setAttribute("class", "button mute " + cell.replace(/[-]/g, ""));
		}
	}
	return tbody;
}

window.onload = function() {
	socket.emit("getMixerConfiguration", (config) => {
		var tbody = makeTableBody(config);
		document.getElementById("mixerTable").appendChild(tbody);
	})
}
function mute(device) {
	socket.emit("mixerToggleMute", device);
}
function changeLevel(device, value) {
	var level = {
		device: device,
		level: value,
	}
	socket.emit("mixerChangeLevel", level);
}
function resetLevels() {
	var tbody = document.getElementById("mixerTable").children[0];
	for (row of Array.from(tbody.children)) {
		var device = row.children[0].innerText;
		console.log("Reset " + device);
		socket.emit("mixerChangeLevel", {device:device,level:0});
	}
}
