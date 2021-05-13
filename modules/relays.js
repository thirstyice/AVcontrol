const Gpio = require("onoff").Gpio;
const relayPins = [17,27,22,5,6,13,19,26]
var relays = [];
try {
	for (var pin of relayPins) {
		relays.push(new Gpio(pin, 'out'))
	}
} catch (e) {
	console.error("Relays: Failed to init gpio:\n" + e);
}



exports.close = function (relay) {
	relays[relay].writeSync(1);
}
exports.open = function (relay) {
	relays[relay].writeSync(0);
}
exports.toggle = function (relay) {
	relays[relay].writeSync(relays[relay].readSync()?1:0);
}
exports.trigger = function (relay) {
	relays[relay].writeSync(1);
	setTimeout(relays[relay].writeSync(0), 500);
}
