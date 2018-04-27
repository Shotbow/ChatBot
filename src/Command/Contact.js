const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'contact',
    commandAliases: ['contactus'],
    processMessage: function (message, tokens) {
        message.channel.send(this.i18n.__mf("Some issues, like rank or payment issues, can only be fixed by contacting support through the \"Contact Us\" link, which can be found here: <{url}>\n\nPlease allow several days for a response.", {url: 'https://shotbow.net/forum/contact'}));
    }
});
