const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'bug',
    commandAliases: ['bugs'],
    processMessage: function (message, tokens) {
        message.channel.send(this.i18n.__mf("Help keep our games stable by reporting bugs here: <{url}>", {url: 'https://bugs.shotbow.net'}));
    }
});
