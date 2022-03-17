const BotModule = require('../BotModule');

module.exports = BotModule.extend({
    config: null,
    dependencies: {
        'config': 'config'
    },
    initialize: function (dependencyGraph) {
        this._super(dependencyGraph);
        this.discordClient.on('message', message => {
            if (message.channel.id == this.config.broadcastRoom && message.crosspostable) {
                message.crosspost()
                    .catch(console.error);
            }
        });
    }
});
