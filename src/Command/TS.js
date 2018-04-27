const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'ts',
    commandAliases: ['teamspeak', 'mumble'],
    processMessage: function (message, tokens) {
        message.channel.send(this.i18n.__mf("You can connect to our TeamSpeak at `{url}` (but, by personal preference, Discord is better).", {url: 'ts.shotbow.net'}));
    }
});
