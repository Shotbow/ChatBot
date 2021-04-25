const BotModule = require('./BotModule');

module.exports = BotModule.extend({
    commandPrefix: '!',
    commandName: null,
    commandAliases: [],
    advertisable: true,
    shouldDeleteMessage: false,
    i18n: null,
    config: null,
    dependencies: {
        'commandPrefix': 'commandPrefix',
        'i18n': 'i18n',
        'config': 'config',
    },
    initialize: function (dependencyGraph) {
        this._super(dependencyGraph);
    },
    execute: function (message, tokens, commandName) {
        if (typeof this.config.languages.channels[message.channel.id] !== 'undefined') {
            this.i18n.setLocale(this.config.languages.channels[message.channel.id]);
        } else {
            this.i18n.setLocale(this.config.languages.default);
        }

        let timeout = this.config.messageRemoveDelay;
        let promise = this.processMessage(message, tokens, commandName);

        if (!this.shouldDeleteMessage) {
            return;
        }

        message.delete({timeout}).catch(() => {/*do nothing*/});

        promise.then(messages => {
            this.deleteMessage(messages, timeout);
        }).catch(error => {
            console.error(`Failed to delete message(s) in command '${commandName}': ${error.message}`);
        });
    },
    processMessage: function (message, tokens, commandName) {

    },
    deleteMessage(element, timeout) {
        if (Array.isArray(element)) {
            for (let message of element) {
                message.delete({timeout}).catch(() => {/*do nothing*/});
            }
        } else if (element) {
            element.delete({timeout}).catch(() => {/*do nothing*/});
        }
    }
});
