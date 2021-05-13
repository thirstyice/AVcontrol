const SerialPort = require("serialport");
const Readline = require('@serialport/parser-readline')
const serialPath = "/dev/null"
const serialport = new SerialPort(serialPath, {baudRate: 9600, dataBits: 8, stopBits: 1, parity: 'none'});
serialport.on('error', (err) => {
	console.error("Paradigm: " + err);
});

var messageHandlers = [[],[]];

function send(sendString) {
	console.info("Paradigm: sending: " + sendString);
	serialport.write(sendString + "\n");
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
exports.addHandler = function (message, handler) {
	messageHandlers[0].push(message);
	messageHandlers[1].push(handler);
}
function removeHandler(messageToRemove, handlerToRemove) {
	messageHandlers[0].forEach((message, index) => {
		if (message == messageToRemove && messageHandlers[1][index] == handlerToRemove) {
			messageHandlers[0].splice(index,1);
			messageHandlers[1].splice(index,1);
		}
	});
}
exports.removeHandler = removeHandler;

const parser = serialport.pipe(new Readline({ delimiter: '\r' }))
parser.on('data', function (data) {
	// var data = port.read()
  console.info('Paradigm data:', data);
	if (data.match(/^error/)) {
		console.error("Paradigm: " + data);
	}
	messageHandlers[0].forEach( (message, index) => {
		if (message.test(data)) {
			messageHandlers[1][index](data);
		}
	});
})
