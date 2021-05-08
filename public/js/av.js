const socket = io();
var names = {
	bluRay: "Blu-Ray",
	booth: "Booth",
	north1: "North 1",
	north2:	"North 2",
	wall: "Wall Box",
	south1: "South 1",
	south2: "South 2",
	northAdjustUp: "Adj Up",
	northAdjustDown: "Adj Down",
	northUp: "Screen Up",
	northDown: "Screen Down",
	southAdjustUp: "Adj Up",
	southAdjustDown: "Adj Down",
	southUp: "Screen Up",
	southDown: "Screen Down"
}
socket.on("audioSlider", (sliderValues) => {
	if (sliderValues.id == "") {
		document.getElementById("audioControls").outerHTML = "";
		document.getElementById("buttonContainer").style.height = "100%";
		return;
	}
	var slider = document.createElement("input");
	slider.setAttribute("type", "range");
	slider.setAttribute("min", "1");
	slider.setAttribute("max", "100");
	slider.setAttribute("value", sliderValues.value);
	//todo: onchange

	var muteButton = document.createElement("button");
	muteButton.innerText = "Mute";
	// TODO: Set mute status
	// TODO: Set onclick


	document.getElementById("sliderContainer").appendChild(slider);
	document.getElementById("muteButtonContainer").appendChild(muteButton);

});
window.onload = function() {
	socket.emit("getAudioSlider");
	if ( typeof tables !== 'undefined' ) {
		["video", "screen", "audio"].forEach((mediaType) => {
			if (tables[mediaType]) {
				tables[mediaType].forEach((row) => {
					var rowElement = document.createElement("tr");
					row.forEach((item) => {
						var itemElement = document.createElement("td");
						if (item != "") {
							itemElement.setAttribute("onclick", "clicked(" + mediaType + "," + item + ")");
							itemElement.setAttribute("class", "button");
							itemElement.innerText = names[item];
						}
						rowElement.appendChild(itemElement);
					});
					document.getElementById(mediaType).getElementsByTagName("tbody")[0].appendChild(rowElement);
				});
			}
		});
	}
}
function clicked(mediaType, command) {
	socket.emit(mediaType, command);
}
