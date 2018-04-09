var Command = require("../command");

module.exports.rules = new Command(
	function() {
		return {};
	},
	function(message, argument) {
		message.channel.send("Please read our rules here: <https://shotbow.net/forum/p/rules/>");
	}
);