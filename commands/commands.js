var Command = require("../command");

module.exports.commands = new Command(
	function() {
		var commandsList = Object.keys(require('../conf').commands);
		for (var i = 0; i < commandsList.length; i ++) commandsList[i] = `\`!${commandsList[i]}\``;
		return {
			"commandsList": commandsList
		};
	},
	function(message, argument) {
		message.channel.send(`All available commands: ${this.dependencies.commandsList.join(", ")}`);
	}
);