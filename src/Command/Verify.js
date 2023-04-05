const Command = require("../Command");

const messages = {
    error: "Unable to grant you a role, please contact a developer or administrator.",
};

module.exports = Command.extend({
    config: null,
    shouldDeleteMessage: true,
    commandName: "verify",
    dependencies: {
        config: "config",
    },
    initialize: function (dependencyGraph) {
        this._super(dependencyGraph);
    },
    processMessage: async function (message) {
        const role = message.guild.roles.cache.get(this.config.verifiedRole);

        let result;
        message.member.roles.add(role).catch((error) => {
            console.error(error);
            result = message.channel.send(this.i18n.__mf(messages.error)).catch((error) => {
                console.error(error);
            });
        });
        if (result) {
            return result;
        }
    },
});
