const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'commands',
    commandList: null,
    dependencies: {
    	'discordClient': 'discordClient',
        'commandPrefix': 'commandPrefix',
        'commandList': 'commandList'
    },
    processMessage: function (message, tokens) {
		let commands = this.commandList.all();
		console.log(commands);
    }
});