const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'commands',
    commandAliases: ['command', 'commandlist', 'help'],
    commandList: null,
    dependencies: {
        'commandList': 'commandList'
    },
    processMessage: function (message, tokens) {
        let commands = this.commandList.all();
        let advertisableList = [];
        for (let key in commands) {
            if (commands[key].advertisable) advertisableList.push("`!" + commands[key].commandName + "`");
        }

        let commandString = advertisableList.join(", ");
        message.channel.send(this.i18n.__mf('All available commands: {commands}', {commands: commandString}));
    }
});
