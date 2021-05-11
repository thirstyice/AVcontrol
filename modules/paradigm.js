const SerialPort = require("serialport");
const Readline = require('@serialport/parser-readline')
const serialPath = "/dev/null"
const serialport = new SerialPort(serialPath, {baudRate: 9600, dataBits: 8, stopBits: 1, parity: 'none'});

var presets = {
	"Studio North":
	[
		"House Full",
		"House Half",
		"House Glow",
		"Custom 1",
		"Custom 2",
		"Custom 3",
	],
	"Studio South":
	[
		"House Full",
		"House Half",
		"House Glow",
		"Custom 1",
		"Custom 2",
		"Custom 3",
	],
	"Global": [
		"House Full",
		"House Half",
		"House Glow",
		"Custom 1",
		"Custom 2",
		"Custom 3",
		"Stage 1",
		"Stage 2",
		"Stage 3",
		"Stage 4",
		"Stage 5",
		"Stage 6",
		"Stage 7",
		"Stage 8",
	]
}

var messageHandlers = {

}

function send(sendString) {
	console.log("Paradigm: sending: " + sendString);
	serialport.write(sendString + "\n");
}
exports.send = send;

exports.getSpaces = function () {
	return presets.keys();
}

exports.getPresets = function (space="Global") {
	if (typeof presets[space] !== "undefined") {
		return presets[space]
	} else {
		throw new Error("Space does not exist");
	}
};
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
exports.addHandler = function (message, handler) {
	messageHandlers[message] = handler;
}
const parser = serialport.pipe(new Readline({ delimiter: '\r' }))
parser.on('data', function (data) {
	// var data = port.read()
  console.log('Paradigm data:', data);
	if (data.match(/^error/)) {
		console.error("Paradigm: " + data);
	}
	if (messageHandlers.keys().includes(data)) {
		messageHandlers[data];
	}
})
