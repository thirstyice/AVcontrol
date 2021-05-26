const promiseTimeout = require("./promise-timeout")
const SerialPort = require("serialport");
const Readline = require('@serialport/parser-readline');
const port = new SerialPort(
	"/dev/null",
	{baudRate: 115200, dataBits: 8, stopBits: 1, parity: 'none'}
);
port.on('error', (err) => {
	console.error("Tesira: " + err);
});
const parser = port.pipe(new Readline({ delimiter: '\r' }))

function send(sendString) {
	console.info("Tesira: write: " + sendString);
	port.write(sendString + "\r\n");
}

exports.setLevel = function (device, level) {
	send('"Level' + device + '" set level 1 ' + level);
}
exports.getLevel = function (device) {
	const listenerCallback = function (data) {
		data = data.match(/-?[0-9.]+/);
		console.info("Tesira level: " + device + " " + data);
		resolve(data);
	}
	return promiseTimeout(
		new Promise(resolve => {
			parser.once("data", listenerCallback);
			send('"Level' + device + '" get level 1');
		})
	).catch((error) => {
		parser.removeListener("data", listenerCallback)
		throw "Tesira: " + error
	})
}
exports.setMute = function (device, muted) {
	send('"Level' + device + '" set mute 1 ' + (!!muted).toString());
}
exports.toggleMute = function (device) {
	send('"Level' + device + '" toggle mute 1');
}
exports.getMute = function (device) {
	const listenerCallback = function (data) {
		data = data.match(/false|true/);
		console.info("Tesira muted: " + device + " " + data);
		resolve(data);
	}
	return promiseTimeout(
		new Promise(resolve => {
			parser.once("data", listenerCallback);
			send('"Level' + device + '" get mute 1');
		})
	).catch((error) => {
		parser.removeListener("data", listenerCallback)
		throw "Tesira: " + error
	})
}

parser.on('data', function (data) {
	console.info('Tesira data:' + data);
	if (data.match(/^-/)) {
		console.error("Tesira error: " + data);
	}
});
