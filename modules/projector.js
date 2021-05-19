const SerialPort = require("serialport");
const port = new SerialPort(
	"/dev/null",
	{baudRate: 115200, dataBits: 8, stopBits: 1, parity: 'none'}
);
port.on('error', (err) => {
	console.error("Projector: " + err);
});

function send(sendString) {
	console.info('Projector write: ' + sendString);
	port.write(sendString + "\r\n");
}

exports.on = function () {
	console.info("Projector: sending power on")
	send("PWR1");
}

exports.off = function () {
	console.info("Projector: sending power off")
	send("PWR3");
}

exports.setChannel = function (channel) {
	console.info("Projector: sending channel " + channel)
	send("CHA " + (100 + channel));
}
