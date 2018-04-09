var Command = require("../command");

module.exports.ip = new Command(
	function() {
		return {};
	},
	function(message, argument) {
		message.channel.send("Come join me on Shotbow using the IP `play.shotbow.net`!");
	}
);