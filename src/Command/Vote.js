const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'vote',
    processMessage: function (message, tokens) {
        let votes = this.config.votes;
        let formattedVotes = [];
        for (let key in votes) formattedVotes.push(`${key}: <${votes[key]}>`);
        message.channel.send(this.i18n.__mf('Support Shotbow for free by voting for us on the following sites:\n') + formattedVotes.join("\n"));
    }
});
