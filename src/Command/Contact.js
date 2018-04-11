const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'contact',
    commandAliases: ['contactus'],
    processMessage: function (message, tokens) {
		message.channel.send("Some issues, like rank or payment issues, can only be fixed by contacting support through the \"Contact Us\" link, which can be found here: <https://shotbow.net/forum/contact>\n\nPlease allow two business days for a response.");
    }
});
