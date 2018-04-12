const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'rules',
    processMessage: function (message, tokens) {
        message.channel.send("Please read our rules here: <https://shotbow.net/forum/p/rules/>");
    }
});
