const BotModule = require('../BotModule');

module.exports = BotModule.extend({
    config: null,
    dependencies: {
        'config': 'config'
    },
    initialize: function (dependencyGraph) {
        this._super(dependencyGraph);
        this.discordClient.on('message', message => {
            for (const i in this.config.swearRegexes) {
                const content = (this.config.swearRegexes[i].stripWhitespace) ? message.content.replace(/\s/g,'').toLowerCase() : message.content.toLowerCase();
                const regex = new RegExp(this.config.swearRegexes[i].regex);
                if (content.match(regex)) {
                    message.delete();
                    return;
                }
            }
        });
    }
});
