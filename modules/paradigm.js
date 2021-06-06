const EventEmitter = require("events")
const emitter = new EventEmitter();
exports.emitter = emitter;
const SerialPort = require("serialport");
const Readline = require('@serialport/parser-readline')
const serialPath = "/dev/null"
const serialport = new SerialPort(serialPath, {baudRate: 9600, dataBits: 8, stopBits: 1, parity: 'none'});
serialport.on('error', (err) => {
	console.error("Paradigm: " + err);
});

function send(sendString) {
	console.info("Paradigm: sending: " + sendString);
	serialport.write(sendString + "\r");
}
exports.send = send;

exports.activate = function(presetName, space="Global") {
	var sendString = "pst act " + presetName + "," + space;
	send(sendString);
}
exports.deactivate = function(presetName="", space="Global") {
	var sendString = "";
	if (presetName == "") {
		sendString = "spc off " + space;
	} else {
		sendString = "pst dact " + presetName + "," + space;
	}
	send(sendString);
}

const parser = serialport.pipe(new Readline({ delimiter: '\r' }))
parser.on('data', function (data) {
	// var data = port.read()
  console.info('Paradigm data: '+ data);
	if (data.match(/^error/)) {
		console.error("Paradigm: " + data);
		emitter.emit("error", new Error(data));
	} else {
		var type = data.match(/^[\w-]*?/)[0];
		var response = data.replace(/^[\w-]*?/,"").trim();
		emitter.emit(type, response);
	}
})
