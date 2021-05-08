const socket = io();
socket.on("setLightingPresets", (presets) => {
	for (const [space, buttons] of Object.entries(presets)) {
		var table = document.createElement("table")
		table.setAttribute("id", space);

		for (var row of buttons) {
			var rowElement = document.createElement("tr");
			for (const [id, name] of Object.entries(row)) {
				var button = document.createElement("td");
				button.id = `${id}`;
				if ( name != "" ) {
					button.className = "button";
				}
				button.setAttribute("onclick", "clicked(this.id)")
				button.innerText = name;
				rowElement.appendChild(button);
			};
			table.appendChild(rowElement);
		}
		var cell = document.createElement("td")
		cell.appendChild(table)
		document.getElementById("presets").getElementsByTagName("tr")[0].appendChild(cell);
	}
});
window.onload = function() {
	socket.emit("getLightingPresets");
}
function clicked(space, preset) {
	// TODO: Change lighting presets
}
