const promiseTimeout = require("./promise-timeout")
const { EventEmitter, once } = require("events");
const emitter = new EventEmitter();
exports.emitter = emitter;
const SerialPort = require("serialport");
const Readline = require('@serialport/parser-readline');
const port = new SerialPort(
	"/dev/tty.usbserial-14210",
	{baudRate: 115200, dataBits: 8, stopBits: 1, parity: 'none'}
);
port.on('error', (err) => {
	console.error("Tesira: " + err);
});
const parser = port.pipe(new Readline({ delimiter: '\r\n' }))

function send(sendString) {
	console.info("Tesira: write: " + sendString);
	port.write(sendString + "\r\n");
}

exports.setLevel = (device, level) => {
	return promiseTimeout(
		new Promise((resolve, reject) => {

			once(emitter, "response")
			.then(resolve).catch(reject);

			send('"' + device + '" set level 1 ' + level);
		})
	).catch((error) => {
		throw "Tesira setLevel(): " + error
	});
}
exports.getLevel = function (device) {
	return promiseTimeout(
		new Promise((resolve, reject) => {

			once(emitter, "response")
			.then(([data]) => {
				resolve(data.match(/"value":(-?[0-9.]*)/)[1])
			}).catch(reject);

			send('"' + device + '" get level 1');
		})
	).catch((error) => {
		throw "Tesira getLevel(): " + error
	});
}
exports.setMute = function (device, muted) {
	return promiseTimeout(
		new Promise((resolve, reject) => {

			once(emitter, "response")
			.then(resolve).catch(reject);

			send('"' + device + '" set mute 1 ' + (!!muted).toString());
		})
	).catch((error) => {
		throw "Tesira setMute(): " + error
	});
}
exports.toggleMute = (device) => {
	return promiseTimeout(
		new Promise((resolve, reject) => {

			once(emitter, "response")
			.then(resolve).catch(reject);

			send('"' + device + '" toggle mute 1');
		})
	).catch((error) => {
		throw "Tesira toggleMute(): " + error
	});
}
exports.getMute = function (device) {
	return promiseTimeout(
		new Promise((resolve, reject) => {

			once(emitter, "response")
			.then(([data]) => {
				resolve(data.match(/false|true/)[0]=="true")
			}).catch(reject);

			send('"' + device + '" get mute 1');
		})
	).catch((error) => {
		throw "Tesira getMute(): " + error
	});
}

parser.on('data', (data) => {
	console.info('Tesira data:' + data);
	if (data.match(/^\+/)) {
		emitter.emit("response", data);
	} else if (data.match(/^-/)) {
		var err = new Error(data);
		emitter.emit("error", err);
	}
});
