const BotModule = require('./BotModule');

module.exports = BotModule.extend({
    commandPrefix: '!',
    commandName: null,
    commandAliases: [],
    advertisable: true,
    dependencies: {
        'discordClient': 'discordClient',
        'commandPrefix': 'commandPrefix'
    },
    initialize: function (dependencyGraph) {
        this._super(dependencyGraph);

        let self = this;
        this.discordClient.on('message', message => {
            let messageText = message.content;
            if (messageText.substr(0, 1) !== self.commandPrefix) return;
            let tokens = message.content.split(' ');
            let command = tokens[0].substr(1).toLowerCase();

            if (command === self.commandName || self.commandAliases.includes(command)) {
                self.processMessage(message, tokens);
            }
        });
    },
    processMessage: function (message, tokens) {

    }
});