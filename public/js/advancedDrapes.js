const socket = io();

var drapes = {
	blackouts: {
		north: [
			["open11","close11","",""],
			["open10","close10","",""],
			["","","",""],
			["","close9","close8","close7"],
			["","open9","open8","open7"]
		],
		south: [
			["open0","","close1","open1"],
			["close0","","close2","open2"],
			["","","close3","open3"],
			["close6","close5","close4",""],
			["open6","open5","open4",""]
		]
	},
	velour: {
		north: [
			["open1", "open2"],
			["close1", "close2"],
			["",""],
			["",""],
			["close10", "close9"],
			["open10", "open9"]
		],
		south: [
			["open3", "open4","",""],
			["close3", "close4","",""],
			["","","close5","open5"],
			["","","close6","open6"],
			["close8", "close7","",""],
			["open8", "open7","",""]
		]
	},
	louvres: {
		north: [
			[""],
			["close4"],
			["open4"]
		],
		south: [
			["","close1","open1"],
			["close3","close2", ""],
			["open3", "open2", ""]
		]
	}
}

window.onload = function() {
	var url = new URL(window.location)
	var drapeType;
	if (url.searchParams.has("drapeType")) {
		drapeType = url.searchParams.get("drapeType");
	}	else {
		drapeType = "velour";
	}
	var iframes = document.getElementsByTagName("iframe");
	if (iframes.length != 0 ) {
		for (iframe of iframes) {
			iframe.setAttribute("src", "/pages-" + iframe.id + "/advancedDrapes.html?drapeType=" + drapeType);
		}
		return;
	}
	var space;
	space = url.pathname.replace("/pages-", "").replace(/\/.*/, "");
	console.log(space);
	if ( space != "" ) {
		var body = document.getElementsByTagName("body")[0];
		var header = document.createElement("h1");
		header.innerText = (space + " " + drapeType).replace(/\b./g, (c) => c.toUpperCase());
		body.appendChild(header);
		var tbody = document.createElement("table").appendChild(
			document.createElement("tbody")
		);
		drapes[drapeType][space].forEach((row) => {
			var rowElement = document.createElement("tr");
			row.forEach((item) => {
				var itemElement = document.createElement("td");
				if (item != "") {
					var itemAction = item.replace(/[0-9]/g, "");
					var itemId = item.replace(/[a-z]/g, "");
					itemElement.setAttribute("onclick", "clicked('" + itemAction + "'," + itemId + ")")
					itemElement.setAttribute("class", "button " + itemAction);
					itemElement.innerText = itemAction.replace(/^\w/, (c) => c.toUpperCase());
				}
				rowElement.appendChild(itemElement);
			});
			tbody.appendChild(rowElement);
		});
		var table = document.createElement("table");
		table.appendChild(tbody);
		body.appendChild(table);
	}
}
function clicked(curtainAction, curtainId) {
	var drape = {
		type: drapeType,
		id: curtainId,
		direction: curtainAction
	};
	socket.emit("moveDrape", drape);
}
