const SerialPort = require("serialport");
const port = new SerialPort(
	"/dev/null",
	{baudRate: 38400, dataBits: 8, stopBits: 1, parity: 'none'}
);
port.on('error', (err) => {
	console.error("Louvres: " + err);
});

function sendCommand(command) {
	console.info("Louvres: sending: " + command)
	port.write(command + "\r\n");
}

exports.open = function (group) {
	sendCommand(":" + group + "060001004B--");
}
exports.close = function (group) {
	sendCommand(":" + group + "060001004E--");
}
exports.stop = function (group) {
	sendCommand(":" + group + "0600010028--");
}
exports.tiltopen = function (group) {
	sendCommand(":" + group + "060001001A--");
}
exports.tiltclose = function (group) {
	sendCommand(":" + group + "0600010016--");
}
exports.auto = function (group) {
	sendCommand(":" + group + "06000104C--");
}
