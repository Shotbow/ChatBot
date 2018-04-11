const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'staff',
    processMessage: function (message, tokens) {
		message.channel.send("View the official Shotbow Staff List here: <https://shotbow.net/forum/wiki/shotbow-staff>");
    }
});
