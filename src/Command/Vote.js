const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'vote',
    processMessage: function (message, tokens) {
		return message.channel.send(this.i18n.__mf('Support us for free by voting for Shotbow! Learn more on our Vote Dashboard at <https://vote.shotbow.net>'));
    }
});
