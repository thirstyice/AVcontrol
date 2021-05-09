const socket = io();
var names = {
	extron: {
		1: "North 1",
		2:	"North 2",
		3: "South 1",
		4: "South 2",
		5: "Wall Box",
		6: "Booth",
		7: "Blu-Ray",
	},
	screens: {
		adjustUp: "Adj Up",
		adjustDown: "Adj Down",
		up: "Screen Up",
		down: "Screen Down"
	}
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
		[
			"video",
			"audio",
			"screen"
		].forEach((mediaType) => {
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
							itemElement.setAttribute("class", "button");
							itemElement.innerText = names[device][item];
						}
						rowElement.appendChild(itemElement);
					});
					document.getElementById(mediaType).getElementsByTagName("tbody")[0].appendChild(rowElement);
				});
			}
		});
	}
}
function extron(mediaType, id) {
	var info = {
		media: mediaType.toString(),
		input: id
	}
	socket.emit("extron", info);
}
function screens() {

}
