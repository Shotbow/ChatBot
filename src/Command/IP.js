const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'ip',
    commandAliases: ['address', 'server', 'connect', 'version'],
    processMessage: function (message, tokens) {
        return message.channel.send(this.i18n.__mf("Come join me on Shotbow using the address `play.shotbow.net`! We support versions 1.12.2 through 1.16.5."));
    }
});
