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

        this.discordClient.on('message', message => {
            let messageText = message.content;
            if (messageText.substr(0, 1) !== this.commandPrefix) return;
            let tokens = message.content.split(' ');
            let command = tokens[0].substr(1).toLowerCase();

            if (typeof this.config.languages.channels[message.channel.id] !== 'undefined') {
                this.i18n.setLocale(this.config.languages.channels[message.channel.id]);
            } else {
                this.i18n.setLocale(this.config.languages.default);
            }

            if (command === this.commandName || this.commandAliases.includes(command)) {
                let timeOut = this.config.messageRemoveDelay;
                let promise = this.processMessage(message, tokens);
                
                if (!this.shouldDeleteMessage) {
                    return;
                }
                
                message.delete(timeOut).catch(err => {/*do nothing*/});
                
                promise.then(messages => {
                    this.deleteMessage(messages, timeOut);
                }).catch(error => {
                    console.error(error.message);
                    done();
                });
            }
        });
    },
    processMessage: function (message, tokens) {

    },
    deleteMessage(element, timeOut) {
        if (element.isArray) {
            for (let message in element) {
                element.delete(timeOut).catch(err => {/*do nothing*/});
            }
        } else {
            element.delete(timeOut).catch(err => {/*do nothing*/});
        }  
    }
});