module.exports = {
    retrieveChannel: function (guild, channelId) {
        const discordChannel = guild.channels.cache.get(channelId);
        if (discordChannel) {
            return discordChannel;
        }
    },
    retrieveChannels: function (guild, channelIds) {
        const channels = [];
        channelIds.forEach((channelId) => {
            const discordChannel = this.retrieveChannel(guild, channelId);
            if (discordChannel) {
                channels.push(discordChannel);
            }
        });
        return channels;
    },
};
