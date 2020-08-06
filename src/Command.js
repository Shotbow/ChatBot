const BotModule = require('./BotModule');
const RoleDeterminer = require('./Helper/RoleDeterminer');

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
    execute: function (message, tokens) {
        if (typeof this.config.languages.channels[message.channel.id] !== 'undefined') {
            this.i18n.setLocale(this.config.languages.channels[message.channel.id]);
        } else {
            this.i18n.setLocale(this.config.languages.default);
        }

        let timeout = this.config.messageRemoveDelay;
        let promise = this.processMessage(message, tokens);

        if (!this.shouldDeleteMessage) {
            return;
        }

        message.delete({timeout}).catch(() => {/*do nothing*/});

        promise.then(messages => {
            this.deleteMessage(messages, timeout);
        }).catch(error => {
            console.error(error.message);
        });
    },
    processMessage: function (message, tokens) {

    },
    deleteMessage(element, timeout) {
        if (element.isArray) {
            for (let message in element) {
                element.delete({timeout}).catch(() => {/*do nothing*/});
            }
        } else {
            element.delete({timeout}).catch(() => {/*do nothing*/});
        }
    }
});
