var Command = require("../command");

module.exports.contact = new Command(
	function() {
		return {};
	},
	function(message, argument) {
		message.channel.send("Some issues, like rank or payment issues, can only be fixed by contacting support through the \"Contact Us\" link, which can be found here: <https://shotbow.net/forum/contact>\n\nPlease allow two business days for a response.");
	}
);