const SerialPort = require("serialport");
const serialPath = ""
//const serialport = new SerialPort(serialPath, {baudRate: 9600, dataBits: 8, stopBits: 1, parity: 'none'});

exports.getPresets = function (space) {
	var presets = {
		north:
		[
			{
				test1: "Test 1",
				north: "North",
				long_test_with_underscores: "Long Test"
			},
			{
				row2: "Row 2",
				spacer: "",
				spaced: "spaced"
			}
		],
		south:
		[
			{
				test1: "Test 1",
				south: "South",
				long_test_with_underscores: "Long Test"
			},
			{
				row2: "Row 2",
				spacer: "",
				spaced: "spaced"
			}
		],
		combined: [
			{
				test1: "Test 1",
				combined: "combined",
				long_test_with_underscores: "Long Test"
			},
			{
				row2: "Row 2",
				spacer: "",
				spaced: "spaced"
			}
		]
	}
	if (typeof presets[space] !== "undefined") {
		return presets[space]
	} else {
		throw new Error("Space does not exist");
	}
};
