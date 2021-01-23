const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'banned',
    commandAliases: ['bans', 'appeal', 'appeals'],
    processMessage: function (message, tokens) {
        return message.channel.send(this.i18n.__mf("We do not discuss bans in the chatroom. If you are banned, please post a ban appeal — it is the fastest way to get your ban handled! <https://shotbow.net/forum/forums/banappeals/>\n\nIf you do not have an account registered on the forums, this thread will also tell you an alternative way to appeal. Please read the entire thread thoroughly."));
    }
});
