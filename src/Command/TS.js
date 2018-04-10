const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'ts',
    processMessage: function (message, tokens) {
		message.channel.send("You can connect to our TeamSpeak at `ts.shotbow.net` (but, by personal preference, Discord is better).");
    }
});
