var Command = require("../command");

module.exports.xp = new Command(
	function() {
		return {};
	},
	function(message, argument) {
		message.channel.send("We have a **special** XP code for people who ask for one! Try `IASKEDFORXP`!");
	}
);