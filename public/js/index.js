const socket = io();
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
}
function lightsOff() {
	socket.emit("lightsOff")
}
