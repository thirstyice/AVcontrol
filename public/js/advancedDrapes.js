window.onload = function() {
	tableArrray.forEach((row) => {
		var rowElement = document.createElement("tr");
		row.forEach((item) => {
			var itemElement = document.createElement("td");
			if (item != "") {
				var itemAction = item.replace(/[0-9]/g, "");
				var itemId = item.replace(/[a-z]/g, "");
				itemElement.setAttribute("onclick", "click(" + itemAction + itemId + ")")
				itemElement.setAttribute("class", itemAction);
				itemElement.innerText = itemAction.replace(/^\w/, (c) => c.toUpperCase());
			}
			rowElement.appendChild(itemElement);
		});
		document.getElementsByTagName("tbody")[0].appendChild(rowElement);
	});
}
function click(curtainAction, curtainId) {

}
