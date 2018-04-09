var Command = require("../command");

module.exports.staff = new Command(
	function() {
		return {};
	},
	function(message, argument) {
		message.channel.send("View the official Shotbow Staff List here: <https://shotbow.net/forum/wiki/shotbow-staff>");
	}
);