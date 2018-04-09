var Command = require("../command");

module.exports.ts = new Command(
	function() {
		return {};
	},
	function(message, argument) {
		message.channel.send("You can connect to our TeamSpeak at `ts.shotbow.net` (but, by personal preference, Discord is better).");
	}
);