const BotModule = require('../BotModule');

module.exports = BotModule.extend({
    config: null,
    i18n: null,
    dependencies: {
        'config': 'config',
        'i18n': 'i18n',
    },
    initialize: function (dependencyGraph) {
        this._super(dependencyGraph);
        this.discordClient.on('messageDelete', message => {
            if (message.guild == null) return;
            message.guild.channels.cache.get(this.config.deletedLogsRoom).send({
                embed: {
                    color: 0xff0000,
                    title: this.i18n.__mf("Deleted message authored by @{username}#{discriminator}", {
                        username: message.author.username,
                        discriminator: message.author.discriminator
                    }),
                    description: message.content,
                    timestamp: new Date(),
                    footer: {
                        icon_url: this.discordClient.user.avatarURL,
                        text: "Shotbow Chat Bot"
                    }
                }
            })
                .catch(() => console.log("Not enough permissions to send a message to the moderation room."));
        });
    }
});
