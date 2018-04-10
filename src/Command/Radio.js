const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'radio',
    processMessage: function (message, tokens) {
		message.channel.send("Did you know we have our own radio? Listen to Mine Theft Auto's radio here: <https://www.minetheftauto.com/radio/>");
    }
});