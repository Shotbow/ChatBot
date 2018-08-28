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
                
                if (!self.shouldDeleteMessage) {
                    return;
                }
                
                message.delete(timeOut);
                
                if (promise == null) {
                    return;   
                }
                
                promise.then(messages => {
                    self.deleteMessage(messages, timeOut);
                }).catch(error => {
                    console.log(error.message);
                });
            }
        });
    },
    processMessage: function (message, tokens, timeOut) {

    },
    deleteMessage(element, timeOut, self) {
        if (self == null && !this.shouldDeleteMessage) {
            return;
        } else if (self != null && !self.shouldDeleteMessage) {
            return;
        }
        
        if (element instanceof Promise) {
            element.then(messages => {
                if (self == null) {
                    this.checkAndDeleteElement(messages, timeOut);
                } else {
                    self.checkAndDeleteElement(messages, timeOut);
                }
            });
        } else {
            if (self == null) {
                this.checkAndDeleteElement(element, timeOut);
            } else {
                self.checkAndDeleteElement(messages, timeOut);
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