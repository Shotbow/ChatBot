const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'vote',
    processMessage: function (message, tokens) {
        return message.channel.send(this.i18n.__mf('Support Shotbow for free by using our vote dashboard: <https://vote.shotbow.net/>')));
    }
});
