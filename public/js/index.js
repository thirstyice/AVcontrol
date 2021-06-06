const socket = io("/index");

socket.on("refresh", () => {
	location.reload();
});

socket.on("connect", () => {
	document.getElementById("disconnectModal").style.display = "none";
});
socket.on("disconnect", (reason) => {
	if (reason === "io server disconnect") {
		socket.connect();
	}
	document.getElementById("disconnectModal").style.display = "block";
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
				td.setAttribute("class", "button " + cell.replace(/[-]/g, ""));
			}
		}
	}
	return tbody;
}
window.onload = function () {
	var url = new URL(window.location)
	var id;
	if (url.searchParams.has("page")) {
		id = url.searchParams.get("page");
	}	else {
		id = "system-info"
	}
	document.getElementsByTagName("iframe")[0].setAttribute("src", "pages/" + id + ".html");
	var menuItems = document.getElementById("menu").children;
	for (var i=0; i < menuItems.length; i++) {
		if (
			menuItems.item(i).getElementsByTagName("a")[0].getAttribute("href")
			==
			"?page=" + id
		) {
			menuItems.item(i).classList.add("active");
		} else {
			menuItems.item(i).classList.remove("active");
		}
	}
	socket.emit("getSystemShutdownConfiguration", (config) => {
		var tbody = makeTableBody(config, "systemShutdown");
		document.getElementById("systemShutdownTable").appendChild(tbody);
	});

}
function openModal(modalId) {
	document.getElementById(modalId).style.display = 'block'
}
function systemShutdown(command) {
	socket.emit("systemShutdown", command);
}
