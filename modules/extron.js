const SerialPort = require("serialport");
const serialPath = ""
//const serialport = new SerialPort(serialPath, {baudRate: 9600, dataBits: 8, stopBits: 1, parity: 'none'});

exports.setPath = function (input, output = "all", mediaType = "") {
	var outString = "";
	input.toString().replace(/input/g, "");
	if (isNaN(input)) {
		throw new Error("Invalid input: " + input);
	}
	outString = input + "*";
	output.toString().replace(/output/g, "");
	if (output != "all") {
		if (isNaN(output)) {
			throw new Error("Invalid output: " + output);
		}
		outString = outString + output;
	}
	var mediaSymbol;
	switch (mediaType) {
		case "audio": mediaSymbol = "$"; break;
		case "video": mediaSymbol = "%"; break;
		case "all": case "": mediaSymbol = "!"; break;
		default: throw new Error ("Unknown media type: " + mediaType);
	}
	outString = outString + mediaSymbol;
	console.log("Extron send: " + outString);
}
