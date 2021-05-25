const SerialPort = require("serialport");
const port = new SerialPort(
	"/dev/null",
	{baudRate: 115200, dataBits: 8, stopBits: 1, parity: 'none'}
);
port.on('error', (err) => {
	console.error("Projector: " + err);
});
const parser = port.pipe(new Readline({ delimiter: '\r\n' }))

var messageHandlers = [[],[]];

function send(sendString) {
	console.info('Projector write: ' + sendString);
	port.write(sendString + "\r\n");
}

exports.setLevel = function (device, level) {
	send('"Level' + device + '" set TODO');
}
exports.getLevel = function (device, callback) {
	parser.once("data", (data) => {
		data = data.match(/[0-9]*/)[0];
		console.info("Tesira level: " device + " " + data);
		callback(data);
	})
	send('"Level' + device + '" get TODO');
}

parser.on('data', function (data) {
	console.info('Tesira data:', data);
	if (data.match(/^-/)) {
		console.error("Tesira error: " + data);
	}
	messageHandlers[0].forEach( (message, index) => {
		if (message.test(data)) {
			messageHandlers[1][index](data);
		}
	});
});
