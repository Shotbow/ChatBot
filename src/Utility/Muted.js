const BotModule = require('../BotModule');
const RoleHelper = require('../Helper/RoleHelper');

module.exports = BotModule.extend({
    config: null,
    dependencies: {
        'config': 'config'
    },
    initialize: function (dependencyGraph) {
        this._super(dependencyGraph);
        this.discordClient.on('message', message => {
            if (RoleHelper.isMuted(message.member)) {
                message.delete();
            }
        });
    }
});
