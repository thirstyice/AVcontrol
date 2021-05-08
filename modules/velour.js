const SerialPort = require("serialport");
const path = ""
//const serialport = new SerialPort(path, {baudRate: 9600, dataBits: 8, stopBits: 1, parity: 'none'});

exports.open = function (curtainId) {
	console.log("Opening velour: " + curtainId);
	//serialport.write("01" + curtainId.padStart(2,"0") + "U");
};
exports.close = function (curtainId) {
	console.log("Closing velour: " + curtainId);
	//serialport.write("01" + curtainId.padStart(2,"0") + "D");
};
exports.stop = function (curtainId) {
	console.log("Stopping velour: " + curtainId);
	//serialport.write("01" + curtainId.padStart(2,"0") + "S");
};
