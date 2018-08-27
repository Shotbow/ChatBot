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
                self.processMessage(message, tokens, timeOut).then(messages => {
                    if (messages.isArray) {
                        for(let message in messages) {
                            message.delete(timeOut);
                        }
                    } else {
                        messages.delete(timeOut);
                    }
                }).catch(error => {
                    console.log(error.message);
                });
                message.delete(timeOut);
            }
        });
    },
    processMessage: function (message, tokens) {

    },
    removeMessage: function (promise, timeOut) {
        
    }
});