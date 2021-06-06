const SerialPort = require("serialport");
const port = new SerialPort(
	"/dev/null",
	{baudRate: 9600, dataBits: 8, stopBits: 1, parity: 'none'}
);
port.on('error', (err) => {
	console.error("Blu-Ray: " + err);
});

function send(sendString) {
	console.info('Blu-Ray write: ' + sendString);
	port.write("#" + sendString + "\r");
}

exports.sendCommand = send;
