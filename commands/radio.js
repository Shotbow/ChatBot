var Command = require("../command");

module.exports.radio = new Command(
	function() {
		return {};
	},
	function(message, argument) {
		message.channel.send("Did you know we have our own radio? Listen to Mine Theft Auto's radio here: <https://www.minetheftauto.com/radio/>");
	}
);