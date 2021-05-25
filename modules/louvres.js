const SerialPort = require("serialport");
const port = new SerialPort(
	"/dev/null",
	{baudRate: 2400, dataBits: 8, stopBits: 1, parity: 'none'}
);
port.on('error', (err) => {
	console.error("Screens: " + err);
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
exports.tiltOpen = function (group) {
	sendCommand(":" + group + "060001001A--");
}
exports.tiltClose = function (group) {
	sendCommand(":" + group + "0600010016--");
}
