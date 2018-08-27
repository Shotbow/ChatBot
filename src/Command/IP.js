const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'ip',
    commandAliases: ['address', 'server'],
    processMessage: function (message, tokens) {
        return message.channel.send(this.i18n.__mf("Come join me on Shotbow using the IP `play.shotbow.net`!"));
    }
});