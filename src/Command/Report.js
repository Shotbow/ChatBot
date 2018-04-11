const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'report',
    commandAliases: ['hacker'],
    processMessage: function (message, tokens) {
		message.channel.send("To report a malicious player, follow our Report a Player guidelines here: <https://shotbow.net/forum/threads/report-a-player-guidelines-read-me-before-posting.344869/>\n\nAre they in game right now?  Type `/report <name>` to report them to our currently online staff!");
    }
});