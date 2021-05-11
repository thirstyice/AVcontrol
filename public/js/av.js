const socket = io();
var names = {
	extron: {
		1: "Wall Box",
		2:	"South 1",
		3: "South 2",
		4: "North 1",
		5: "North 2",
		6: "Booth",
		7: "Blu-Ray"
	},
	screens: {
		adjustUp: "Adj Up",
		adjustDown: "Adj Down",
		up: "Screen Up",
		down: "Screen Down",
	},
	bluRay: {
		control: "Blu-Ray Control"
	},
	projector: {
		off: "Power off Projector",
		preset1: "Presentation High",
		preset2: "Presentation Low"
	}
}
socket.on("audioSlider", (sliderValues) => {
	if (sliderValues.id == "") {
		document.getElementById("audioControls").outerHTML = "";
		document.getElementById("buttonContainer").style.height = "100%";
		return;
	} else if (typeof sliderValues.id != "undefined") {
		var slider = document.createElement("input");
		slider.setAttribute("type", "range");
		slider.setAttribute("min", "0");
		slider.setAttribute("max", "64");
		slider.id = "audioSlider";
		slider.setAttribute("onchange", "audioSliderDidChange(this.value)");

		var muteButton = document.createElement("button");
		muteButton.setAttribute("onclick", "socket.emit('toggleMute')");
		muteButton.id = "muteButton";
		muteButton.innerText = "Mute";

		document.getElementById("sliderContainer").appendChild(slider);
		document.getElementById("muteButtonContainer").appendChild(muteButton);
	}
	if (typeof sliderValues.level != "undefined") {
		var slider = document.getElementById("audioSlider")
		if (slider !=null) {
			slider.setAttribute("value", sliderValues.level);
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
});
window.onload = function() {
	socket.emit("getAudioSliderValues");
	if ( typeof tables !== 'undefined' ) {
		[
			"video",
			"audio",
			"screen",
			"bluRay",
			"projector"
		].forEach((mediaType) => {
			var mediaTables = document.getElementsByClassName(mediaType + "Table");
			if (mediaTables != null) {
				var device = mediaType;
				switch (mediaType) {
					case "audio": case "video": device = "extron"; break;
					case "screen": device = "screens"; break;
				}
				if (tables[device]) {
					tables[device].forEach((row) => {
						var rowElement = document.createElement("tr");
						row.forEach((item) => {
							var itemElement = document.createElement("td");
							if (item != "") {
								itemElement.setAttribute("onclick", device + "('" + mediaType + "'," + item + ")");
								itemElement.setAttribute("class", "button " + mediaType + " " + item);
								itemElement.innerText = names[device][item];
							}
							rowElement.appendChild(itemElement);
						});
						for (var i=0; i<mediaTables.length; i++){
							mediaTables.item(i).classList.add("mediaTable");
							mediaTables.item(i).getElementsByTagName("tbody")[0].appendChild(rowElement);
						}
					});
				}
			}
		});
	}
}
function audioSliderDidChange(value) {
	console.log("Slider: ", value);
	socket.emit("setAudioLevel", value);
}
function extron(mediaType, id) {
	var info = {
		media: mediaType.toString(),
		input: id
	}
	socket.emit("extron", info);
}
function screens() {
	// TODO:
}
function projector() {
	// TODO: 
}
