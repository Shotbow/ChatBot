const BotModule = require('../BotModule');

const messages = {
    boost: "<@{discordId}> Thanks for boosting!\nIf you would like to claim your in-game rank, please private message {upgrader} on the forums with the title \"Nitro role\" as well as your Discord Username and Discriminator ({username}#{discriminator})\n<{link}>"
}

module.exports = BotModule.extend({
    config: null,
    i18n: null,
    dependencies: {
        'config': 'config',
        'i18n': 'i18n'
    },

    initialize: function (dependencyGraph) {
        this._super(dependencyGraph);

        this.discordClient.on('guildMemberUpdate', this.checkNewBoost.bind(this));
    },

    /**
     * @param {GuildMember} oldMember
     * @param {GuildMember} newMember
     */
    checkNewBoost: function (oldMember, newMember) {
        if (oldMember.premiumSinceTimestamp !== null || newMember.premiumSinceTimestamp === null) {
            // If they were already premium, or they are not premium now - they didn't just get premium.
            // This is intended to be the inverse of `if (old.timestamp === null && new.timestamp !== null)`
            // in early to support an early exit
            return;
        }

        newMember.guild.channels.cache.get(this.config.nitro.channel).send(
            this.i18n.__mf(
                messages.boost,
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
