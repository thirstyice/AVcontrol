const SerialPort = require("serialport");
const path = ""
//const serialport = new SerialPort(path, {baudRate: 9600, dataBits: 8, stopBits: 1, parity: 'none'}

exports.open = function (curtainId) {
	console.log("Opening blackout: " + curtainId);
	serialport.send("#DEVICE,1," + curtainId + ",18");
};
exports.close = function (curtainId) {
	console.log("Opening blackout: " + curtainId);
	serialport.send("#DEVICE,1," + curtainId + ",19");
};
exports.stop = function (curtainId) {
	console.log("Stopping blackout: " + curtainId);
	serialport.send("#DEVICE,1," + curtainId + ",20");
}
exports.recallPosition(curtainId) {
	serialport.send("#DEVICE,1," + curtainId + ",3");
}
