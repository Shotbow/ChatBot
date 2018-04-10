const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'bug',
    processMessage: function (message, tokens) {
		message.channel.send("Help keep our games stable by reporting bugs here: <https://shotbow.net/forum/p/bugs/>");
    }
});