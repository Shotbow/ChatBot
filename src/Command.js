const BotModule = require('./BotModule');

const languageMap = {
    '368751492963893248': 'ja',
};

module.exports = BotModule.extend({
    commandPrefix: '!',
    commandName: null,
    commandAliases: [],
    advertisable: true,
    i18n: null,
    dependencies: {
        'commandPrefix': 'commandPrefix',
        'i18n': 'i18n',
    },
    initialize: function (dependencyGraph) {
        this._super(dependencyGraph);

        let self = this;
        this.discordClient.on('message', message => {
            let messageText = message.content;
            if (messageText.substr(0, 1) !== self.commandPrefix) return;
            let tokens = message.content.split(' ');
            let command = tokens[0].substr(1).toLowerCase();

            if (typeof languageMap[message.channel.id] !== 'undefined') {
                this.i18n.setLocale(languageMap[message.channel.id]);
            } else {
                this.i18n.setLocale('en');
            }

            if (command === self.commandName || self.commandAliases.includes(command)) {
                self.processMessage(message, tokens);
            }
        });
    },
    processMessage: function (message, tokens) {

    }
});
