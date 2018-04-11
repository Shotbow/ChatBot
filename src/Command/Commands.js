const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'commands',
    commandAliases: ['command', 'commandlist', 'help'],
    commandList: null,
    dependencies: {
    	'discordClient': 'discordClient',
        'commandPrefix': 'commandPrefix',
        'commandList': 'commandList'
    },
    processMessage: function (message, tokens) {
		let commands = this.commandList.all();
        let advertisableList = [];
		for (let key in commands) {
            if (commands[key].advertisable) advertisableList.push("`!" + commands[key].commandName + "`");
        }
        message.channel.send(`All available commands: ${advertisableList.join(", ")}`);
    }
});