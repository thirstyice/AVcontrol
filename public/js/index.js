window.onload = function () {
	var menuItems = document.getElementById("menu").children;
	for (var i=0; i < menuItems.length; i++) {
		var item = menuItems.item(i);
		item.setAttribute("onclick", "select(this.id)");
	}
}

function select(id) {
	var menuItem = document.getElementById(id);
	var formerActive = document.getElementsByClassName("active");
	for (var i=0; i < formerActive.length; i++) {
		formerActive.item(i).classList.remove("active");
	}
	menuItem.classList.add("active");
	document.getElementsByTagName("iframe")[0].setAttribute("src", "pages/" + id + ".html")
}
