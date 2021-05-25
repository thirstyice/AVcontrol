const SerialPort = require("serialport");
const port = new SerialPort(
	"/dev/null",
	{baudRate: 2400, dataBits: 8, stopBits: 1, parity: 'none'}
);
port.on('error', (err) => {
	console.error("Screens: " + err);
});

function sendCommand(command, space) {
	console.info("Louvres: sending: " + command)
	port.write(command);
}

exports.open = function (group) {

}
exports.close = function (group) {

}
exports.stop = function (group) {

}
exports.tiltOpen = function (group) {

}
exports.tiltClose = function (group) {

}
