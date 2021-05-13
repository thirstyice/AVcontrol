const SerialPort = require("serialport");
const Readline = require('@serialport/parser-readline');
const serialPath = "/dev/null"
const serialport = new SerialPort(serialPath, {baudRate: 9600, dataBits: 8, stopBits: 1, parity: 'none'});
serialport.on('error', (err) => {
	console.error("Extron: " + err);
});
const parser = serialport.pipe(new Readline({ delimiter: '\r' }))

var messageHandlers = [[],[]];
function send(sendString) {
	console.info('Extron write: ' + sendString);
	serialport.write(sendString + "\r\n");
}

exports.setPath = function (input, output = "all", mediaType = "") {
	var outString = "";
	input=input.toString();
	if (isNaN(input)) {
		console.error("Extron: Invalid input: " + input);
	}
	outString = input.padStart(2,"0") + "*";
	output = output.toString();
	if (output != "all") {
		if (isNaN(output)) {
			console.error("Extron: Invalid output: " + output);
		}
		outString = outString + output.padStart(2,"0");
	}
	var mediaSymbol;
	switch (mediaType) {
		case "audio": mediaSymbol = "$"; break;
		case "video": mediaSymbol = "%"; break;
		case "all": case "": mediaSymbol = "!"; break;
		default: console.error("Extron: Unknown media type: " + mediaType);
	}
	outString = outString + mediaSymbol;
	send(outString);
}
exports.setAudioLevel = function (output, level) { // level: 0-64
	sendString = output.toString().padStart(2,"0") + "*" + level.toString().padStart(2,"0") + "v";
	send(sendString);
}
exports.requestAudioLevel = function (output, callback) {
	sendString = output.toString().padStart(2,"0") + "v";
	var regex = /.*/;
	var handler = (data) => {
		callback(data);
		removeHandler(regex, handler);
	};
	addHandler(regex, handler);
	send(sendString);
}
exports.muteAudio = function (output) {
	sendString = output.toString().padStart(2,"0") + "*3z";
}
exports.unmuteAudio = function (output) {
	sendString = output.toString().padStart(2,"0") + "*0z";
}
exports.requestIsMuted = function (output, callback) {
	sendString = output.toString().padStart(2,"0") + "z";
	var regex = /.*/;
	var handler = (data) => {
		callback(!!data);
		removeHandler(regex, handler);
	};
	addHandler(regex, handler);
	send(sendString);
}
function addHandler(message, handler) {
	messageHandlers[0].push(message);
	messageHandlers[1].push(handler);
}
exports.addHandler = addHandler;

function removeHandler(messageToRemove, handlerToRemove) {
	messageHandlers[0].forEach((message, index) => {
		if (message == messageToRemove && messageHandlers[1][index] == handlerToRemove) {
			messageHandlers[0].splice(index,1);
			messageHandlers[1].splice(index,1);
		}
	});
}
exports.removeHandler = removeHandler;

// serialport.on('data', console.log)
parser.on('data', function (data) {
	// var data = port.read()
	console.info('Extron data:', data);
	if (data.match(/^E/)) {
		var errorName;
		switch (data) {
			case "E01": errorName = "Input number out of range"; break;
			case "E10": errorName = "Invalid command"; break;
			case "E11": errorName = "Preset number out of range"; break;
			case "E12": errorName = "Output number out of range"; break;
			case "E13": errorName = "Value out of range"; break;
			case "E14": errorName = "Invalid command for configuration"; break;
			case "E17": errorName = "Timeout"; break;
			case "E22": errorName = "Busy"; break;
			case "E24": errorName = "Privileges violation"; break;
			case "E25": errorName = "Device not present"; break;
			case "E26": errorName = "Exceed max connections"; break;
			case "E27": errorName = "Invalid event number"; break;
			case "E28": errorName = "File not found"; break;
			default: errorName = "Unknown error";
		}
		console.error("Extron error: " + data + "\n" + errorName);
	}
	messageHandlers[0].forEach( (message, index) => {
		if (message.test(data)) {
			messageHandlers[1][index](data);
		}
	});
});
