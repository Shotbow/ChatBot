var Command = require("../command");

module.exports.bug = new Command(
	function() {
		return {};
	},
	function(message, argument) {
		message.channel.send("Help keep our games stable by reporting bugs here: <https://shotbow.net/forum/p/bugs/>");
	}
);