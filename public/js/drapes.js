window.onload = function() {
	headings = document.getElementById("headings").children;
	for (var i=0; i < headings.length; i++) {
		heading = headings.item(i);
		["Open", "Close"].forEach((direction, j) => {
			var node = document.createElement("td");
			node.setAttribute("onclick", "click(" + heading.id + direction + ")");
			node.innerText = direction;
			document.getElementById(direction).appendChild(node);
		});


	}

}

function click(name) {
}
