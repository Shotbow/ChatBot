const BotModule = require('../BotModule');

const Message = {
    boost: '<@{discordId}> Thanks for boosting!\\nIf you would like to claim your in-game rank, please [private message {upgrader} on the forums]({link}) with your Discord Username and Discriminator ({username}#{discriminator})'
}

module.exports = BotModule.extend({
    i18n: null,
    dependencies: {
        'i18n': 'i18n'
    },

    initialize: function (dependencyGraph) {
        this._super(dependencyGraph);

        this.discordClient.on('guildMemberUpdate', this.checkNewBoost.bind(this));
    },

    checkNewBoost: function (oldMember, newMember) {
        if (oldMember.premiumSinceTimestamp !== null || newMember.premiumSinceTimestamp === null) {
            // If they were already premium, or they are not premium now - they didn't just get premium.
            // This is intended to be the inverse of `if (old.timestamp === null && new.timestamp !== null)`
            // in early to support an early exit
            return;
        }

        newMember.guild.channels.find(this.config.nitro.channel).send(
            this.i18n.__mf(
                Message.boost,
                {
                    discordId: newMember.user.id,
                    upgrader: this.config.nitro.manualUpgradeStaffer,
                    username: newMember.user.username,
                    discriminator: newMember.user.discriminator,
                    link: 'https://shotbow.net/forum/conversations/add?to=' + this.config.nitro.manualUpgradeStaffer
                }
            )
        )
    }
});
