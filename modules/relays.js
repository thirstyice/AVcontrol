const Gpio = require("onoff").Gpio;
const relayPins = [17,27,22,5,6,13,19,26]
var relays = [];
try {
	for (var pin of relayPins) {
		relays.push(new Gpio(pin, 'out'));
	}
} catch (e) {
	console.error("Relays: Failed to init gpio:\n" + e);
}



exports.close = function (relay) {
	console.info("Relays: set " + relay + " closed")
	relays[relay].writeSync(1);
}
exports.open = function (relay) {
	console.info("Relays: set " + relay + " open")
	relays[relay].writeSync(0);
}
exports.toggle = function (relay) {
	console.info("Relays: toggle " + relay);
	switch (relays[relay].readSync()) {
		case 0: this.close(relay); break;
		case 1: this.open(relay); break;
		default: console.error("Relays: " + relay + " in unknown state");
	}
}
exports.trigger = function (relay) {
	console.info("Relays: trigger " + relay);
	this.close(relay);
	setTimeout(() => {this.open(relay)}, 500);
}
