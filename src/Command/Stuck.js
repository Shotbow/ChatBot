const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'stuck',
    processMessage: function (message, tokens) {
		message.channel.send("Stuck in a block or area on MineZ? Request to be moved here: <https://shotbow.net/forum/threads/stuck-in-a-block-or-area.266338/>");
    }
});
