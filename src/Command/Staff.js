const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'staff',
    processMessage: function (message, tokens) {
        return message.channel.send(this.i18n.__mf("View the official Shotbow Staff List here: <{url}>", {url:'https://wiki.shotbow.net/Shotbow_Staff'}));
    }
});
