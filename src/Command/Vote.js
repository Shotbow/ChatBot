const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'vote',
    processMessage: function (message, tokens) {
		return message.channel.send(this.i18n.__mf('Vote for Shotbow on our Vote Dashboard: <https://vote.shotbow.net>\n\nYou will receive a 100 XP reward for each vote you cast. Votes will additionally contribute to the community counter for even more free XP!'));
    }
});
