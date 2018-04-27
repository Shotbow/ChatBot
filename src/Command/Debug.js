const Command = require('../Command');

const messages = {
    success: 'I am currently operating off commit `{key}`.\nGitHub: https://github.com/Shotbow/ChatBot/commit/{key}',
    error: 'I do not know what version I am currently running.',
};

module.exports = Command.extend({
    commandName: 'debug',
    commandAliases: ['version', 'hash'],
    advertisable: false,
    proc: null,
    version: null,
    dependencies: {
        'child_process': 'proc'
    },

    initialize: function (dependencyGraph) {
        this._super(dependencyGraph);

        this.proc.exec('git rev-parse HEAD', function (err, stdout) {
            if (stdout) {
                this.version = stdout.trim();
            }
        }.bind(this))
    },

    processMessage: function (message, tokens) {
        if (this.version) {
            message.channel.send(this.i18n.__mf(messages.success, {key: this.version}));
        } else {
            message.channel.send(this.i18n.__mf(messages.error));
        }
    }
});
