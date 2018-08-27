const BotModule = require('./BotModule');

module.exports = BotModule.extend({
    commandPrefix: '!',
    commandName: null,
    commandAliases: [],
    advertisable: true,
    i18n: null,
    config: null,
    dependencies: {
        'commandPrefix': 'commandPrefix',
        'i18n': 'i18n',
        'config': 'config',
    },
    initialize: function (dependencyGraph) {
        this._super(dependencyGraph);

        let self = this;
        this.discordClient.on('message', message => {
            let messageText = message.content;
            if (messageText.substr(0, 1) !== self.commandPrefix) return;
            let tokens = message.content.split(' ');
            let command = tokens[0].substr(1).toLowerCase();

            if (typeof this.config.languages.channels[message.channel.id] !== 'undefined') {
                this.i18n.setLocale(this.config.languages.channels[message.channel.id]);
            } else {
                this.i18n.setLocale(this.config.languages.default);
            }

            if (command === self.commandName || self.commandAliases.includes(command)) {
                let timeOut = this.config.messageRemoveDelay;
                let promise = self.processMessage(message, tokens, timeOut);
                if (promise != null) {
                    promise.then(messages => {
                        self.deleteMessage(messages, timeOut);
                    }).catch(error => {
                        console.log(error.message);
                    });
                }
                message.delete(timeOut);
            }
        });
    },
    processMessage: function (message, tokens, timeOut) {

    },
    deleteMessage(element, timeOut, deleteFunction) {
        if (element instanceof Promise) {
            element.then(messages => {
                if (deleteFunction == null) {
                    this.checkAndDeleteElement(messages, timeOut);
                } else {
                    deleteFunction(messages, timeOut);
                }
            });
        } else {
            if (deleteFunction == null) {
                this.checkAndDeleteElement(element, timeOut);
            } else {
                deleteFunction(messages, timeOut);
            }
        }
    },
    checkAndDeleteElement(element, timeOut) {
        if (element.isArray) {
            for(let message in element) {
                element.delete(timeOut);
            }
        } else {
            element.delete(timeOut);
        }                        
    }
});