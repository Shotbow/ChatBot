const BotModule = require('../BotModule');
const RoleDeterminer = require('../Helper/RoleDeterminer');

module.exports = BotModule.extend({
    config: null,
    dependencies: {
        'config': 'config'
    },
    initialize: function (dependencyGraph) {
        this._super(dependencyGraph);
        this.discordClient.on('message', message => {
            if (RoleDeterminer.isMuted(message.member)) {
                message.delete();
            }
        });
    }
});
