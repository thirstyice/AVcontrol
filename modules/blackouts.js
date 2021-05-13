const SerialPort = require("serialport");
const path = "/dev/null"
const port = new SerialPort(path, {baudRate: 9600, dataBits: 8, stopBits: 1, parity: 'none'});
port.on('error', (err) => {
	console.error("Blackouts: " + err);
});

// #DEVICE,T105 View Window,1,18 -> open viewing window
// #DEVICE, T105 Event   1,1,19 -> close SE


// T105 Event   1 -> SE
// T105 Event   2 -> S
// T105 Event   3 -> SSW
// T105 Event   4 -> SW
// T105 Event   5 -> WSW
// T105 Event   6 -> W

// T105 Event   7 -> WNW
// T105 Event   8 -> NW; Replace with: 0x01E983DF
// T105 Event   9 -> N
// T105 Event   10 -> N Wall
// T105 Event   11 -> Beside booth; Replace with: 0x01E983E0

function decodeID(id) {
	switch (id) {
		case 0: return "T105 View Window"; break;
		case 8: return "01E983DF"; break;
		case 11: return "01E983E0"; break;
		default: return "T105 Event   " + id;
	}
}

function getDirectionCode(direction) {
	switch (direction) {
		case "open": return "18"; break;
		case "close": return "19"; break;
		case "stop": return "20"; break;
		case "recall": return "3"; break;
		default: console.log("Blackouts: unknown direction");
	}
}

exports.move = function (id, direction) {
	var directionCode = getDirectionCode(direction);
	var sendString = "";
	if (id == "north") {
		sendString = "#DEVICE,cspaceQSE,3," + directionCode;
	} else if (id == "south") {
		sendString = "#DEVICE,cspaceQSE,2," + directionCode;
	} else if (id == "all") {
		sendString = "#DEVICE,cspaceQSE,1," + directionCode;
	} else {
		id = decodeID(id);
		sendString = "#DEVICE," + id + ",1," + directionCode;
	}
	port.write(sendString);
	console.info("Blackout: sending: " + sendString);
}
