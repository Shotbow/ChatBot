const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'rules',
    processMessage: function (message, tokens) {
        return message.channel.send(this.i18n.__mf("Please read our rules here: <{url}>", {url: 'https://shotbow.net/forum/p/rules/'}));
    }
});
