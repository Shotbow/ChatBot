const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'commands',
    commandAliases: ['command', 'commandlist', 'help'],
    commandList: null,
    dependencies: {
        'commandList': 'commandList'
    },
    processMessage: function (message) {
        let commands = this.commandList.allCommands();
        let advertisableList = [];
        for (let key in commands) {
            if (commands.hasOwnProperty(key) && commands[key].advertisable) {
                advertisableList.push(`\`!${key}\``);
            }
        }

        let commandString = advertisableList.join(", ");
        return message.channel.send(this.i18n.__mf('All available commands: {commands}', {commands: commandString}));
    }
});
