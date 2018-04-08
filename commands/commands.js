module.exports.execute = function(message, argument) {
	var commands = Object.keys(require('../conf').commands);
	for (var i = 0; i < commands.length; i ++) commands[i] = `\`!${commands[i]}\``;
	message.channel.send(`All available commands: ${commands.join(", ")}`);
}