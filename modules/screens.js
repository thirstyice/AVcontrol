const relays = require("./relays");
const SerialPort = require("serialport");
const port = new SerialPort(
	"/dev/null",
	{baudRate: 2400, dataBits: 8, stopBits: 1, parity: 'none'}
);

const relayPatch = {
	south: {
		raise: 0,
		lower: 2,
		stop: 3
	},
	northWinch: {
		raise: 5,
		lower: 6,
		stop: 7
	}
}
const northScreenSerialCommands = {
	initial: [0xff, 0xee, 0xee, 0xee],
	up: 0xdd,
	down: 0xee,
	stop: 0xcc,
	microDown: 0xc9,
	microUp: 0xe9
}

function sendNorthScreenCommand(command) {
	for (hex of northScreenSerialCommands.initial) {
		port.write(hex);
	}
	port.write(northScreenSerialCommands[command]);
}

exports.raiseNorth = function () {
	relays.trigger(relayPatch.northWinch.raise);
	sendNorthScreenCommand("up");
}
exports.lowerNorth = function () {
	relays.trigger(relayPatch.northWinch.lower);
	sendNorthScreenCommand("down");
}
exports.stopNorth = function () {
	relays.trigger(relayPatch.northWinch.stop);
	sendNorthScreenCommand("stop");
}
exports.jogUpNorth = function () {
	sendNorthScreenCommand("microUp");
}
exports.jogDownNorth = function () {
	sendNorthScreenCommand("microDown");
}

exports.raiseSouth = function () {
	relays.trigger(relayPatch.south.raise);
}
exports.lowerSouth = function () {
	relays.trigger(relayPatch.south.lower);
}
exports.stopSouth = function () {
	relays.trigger(relayPatch.south.stop);
}
exports.jogUpSouth = function () {
	this.raiseSouth();
	setTimeout(this.stopSouth(), 200);
}
exports.jogDownSouth = function () {
	this.lowerSouth();
	setTimeout(this.stopSouth(), 200);
}
