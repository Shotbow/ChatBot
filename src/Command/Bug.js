const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'bug',
    commandAliases: ['bugs'],
    processMessage: function (message, tokens) {
        return message.channel.send(this.i18n.__mf("Help keep our games stable by reporting bugs! You can report a bug by executing the command `!support bug <IGN>`."));
    }
});
