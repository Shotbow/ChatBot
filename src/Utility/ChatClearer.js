const BotModule = require("../BotModule");

const interval = 60 * 1000;
const defaultRetention = 60 * 1000;

module.exports = BotModule.extend({
    config: null,
    dependencies: {
        config: "config",
    },
    initialize: function (dependencyGraph) {
        this._super(dependencyGraph);

        this.discordClient.once("ready", () => {
            const configChannels = this.config.clearers;
            if (!configChannels) {
                return;
            }
            const channels = this.retrieveChannels(configChannels);
            if (!channels) {
                return;
            }

            setInterval(() => {
                channels.forEach(async (channel) => {
                    const retention = channel.configChannel.retention
                        ? channel.configChannel.retention
                        : defaultRetention;

                    let messages = await channel.discordChannel.messages.fetch({ limit: 50 });
                    if (messages && messages.size > 0) {
                        if (channel.configChannel.message) {
                            messages = messages.filter(
                                (message) =>
                                    message.content !== channel.configChannel.message || !this.isPostedByBot(message)
                            );
                        }
                        messages = messages.filter((message) => message.createdTimestamp < Date.now() - retention);
                        await channel.discordChannel.bulkDelete(messages);
                    } else {
                        if (channel.configChannel.message) {
                            await channel.discordChannel.send(channel.configChannel.message);
                        }
                    }
                });
            }, interval);
        });
    },
    retrieveChannels: function (configChannels) {
        const channels = [];
        this.discordClient.guilds.cache.forEach((guild) => {
            configChannels.forEach((configChannel) => {
                const discordChannel = guild.channels.cache.get(configChannel.channel);
                if (discordChannel) {
                    channels.push({ discordChannel, configChannel });
                }
            });
        });
        return channels;
    },
    isPostedByBot: function (message) {
        return message.author.id === this.discordClient.user.id;
    },
});
