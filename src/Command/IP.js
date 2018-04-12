const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'ip',
    commandAliases: ['address'],
    processMessage: function (message, tokens) {
        message.channel.send("Come join me on Shotbow using the IP `play.shotbow.net`!");
    }
});
