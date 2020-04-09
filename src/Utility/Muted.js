const BotModule = require('../BotModule');

module.exports = BotModule.extend({
    config: null,
    dependencies: {
        'config': 'config'
    },
    initialize: function (dependencyGraph) {
        this._super(dependencyGraph);
        this.discordClient.on('message', message => {
            let member = message.member;
            let hasRoles = member !== null && typeof member.roles !== 'undefined';
            if (hasRoles && member.roles.has(message.guild.roles.find("name", "Muted").id)) {
                message.delete();
            }
        });
    }
});
