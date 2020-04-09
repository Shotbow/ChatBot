const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'clans',
    processMessage: function (message, tokens) {
        return message.channel.send(this.i18n.__mf("Looking for a group to play with on Shotbow? Check out some of our clans! <{url}>", {url: 'https://shotbow.net/forum/forums/lookingforgroup/'}));
    }
});
