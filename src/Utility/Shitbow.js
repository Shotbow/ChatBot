const BotModule = require('../BotModule');

module.exports = BotModule.extend({
    initialize: function (dependencyGraph) {
        this._super(dependencyGraph);
        this.discordClient.on('message', message => {
            if (message.content.replace(/\s/g,'').toLowerCase().indexOf("shitbow") >= 0) message.delete();
        });
    }
});