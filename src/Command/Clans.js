const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'clans',
    processMessage: function (message, tokens) {
		message.channel.send("Looking for a group to play with on Shotbow? Check out some of our clans! <https://shotbow.net/forum/forums/lookingforgroup/>");
    }
});