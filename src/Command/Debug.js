const Command = require('../Command');

const messages = {
    success: 'I am currently operating off commit `{key}`.\nGitHub: <https://github.com/Shotbow/ChatBot/commit/{key}>',
    error: 'I do not know what version I am currently running.',
};

module.exports = Command.extend({
    commandName: 'debug',
    commandAliases: ['commit', 'hash'],
    advertisable: false,
    proc: null,
    version: null,

    processMessage: function (message, tokens) {
        return message.channel.send(this.i18n.__mf(messages.success, {key: this.config.ref}));
    }
});
