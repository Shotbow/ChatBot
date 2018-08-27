const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'radio',
    processMessage: function (message, tokens) {
        return message.channel.send(this.i18n.__mf("Did you know we have our own radio? Listen to Mine Theft Auto's radio here: <{url}>", {url: 'https://www.minetheftauto.com/radio/'}));
    }
});
