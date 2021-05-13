const SerialPort = require("serialport");
const path = "/dev/null"
const serialport = new SerialPort(path, {baudRate: 9600, dataBits: 8, stopBits: 1, parity: 'none'});

exports.open = function (curtainId, direction) {
	console.log("Velour: Opening: " + curtainId);
	serialport.write("01" + curtainId.toString().padStart(2,"0") + "U");
};
exports.close = function (curtainId) {
	console.log("Velour: Closing: " + curtainId);
	serialport.write("01" + curtainId.toString().padStart(2,"0") + "D");
};
exports.stop = function (curtainId) {
	console.log("Velour: Stopping: " + curtainId);
	serialport.write("01" + curtainId.toString().padStart(2,"0") + "S");
};
