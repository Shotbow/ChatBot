const BotModule = require('../BotModule');
const archiveRoom = require('../Helper/SupportRoomArchiver');
const parseRoomType = require('../Helper/SupportRoomTypeParser');

const messages = {
    'warning': 'It appears that there was no activity in this room for a while. If no more activity takes place, I will automatically close this channel.'
}
const interval = 60 * 60 * 1000;

module.exports = BotModule.extend({
    config: null,
    i18n: null,
    moment: null,
    dependencies: {
        'config': 'config',
        'i18n': 'i18n',
        'moment': 'moment'
    },
    initialize: function (dependencyGraph) {
        this._super(dependencyGraph);

        this.discordClient.once("ready", () => {
            const supportCategory = this.retrieveSupportCategory();
            if (!supportCategory || !supportCategory.children) {
                console.warn("Warning: Could not retrieve support category for automatic support closer utility");
                return;
            }

            setInterval(() => {
                const supportRooms = supportCategory.children;
                supportRooms.forEach(async supportRoom => {
                    const lastMessage = await this.retrieveLastMessage(supportRoom);
                    if (!lastMessage) {
                        return;
                    }

                    const now = this.moment();

                    /* Check if we should send a warning notice */
                    const typeKey = parseRoomType(supportRoom.name);
                    let messageTimestamp = this.moment(lastMessage.createdTimestamp);
                    if (this.config.support.types[typeKey].autoClose && this.config.support.types[typeKey].autoClose.warning 
                        && now.isAfter(messageTimestamp.add(this.config.support.types[typeKey].autoClose.warning, 'ms'))
                        && lastMessage.content !== messages.warning) {
                        supportRoom.send(this.i18n.__mf(messages.warning, {timeInactivity: 0, timeToClose: 0}));
                        return;
                    }

                    /* Check if we should close the channel (moment mutates the timestamp, hence the re-init) */
                    messageTimestamp = this.moment(lastMessage.createdTimestamp);
                    if (lastMessage.content === messages.warning
                        && this.config.support.types[typeKey].autoClose && this.config.support.types[typeKey].autoClose.closing 
                        && now.isAfter(messageTimestamp.add(this.config.support.types[typeKey].autoClose.closing, 'ms'))) {
                        await archiveRoom(lastMessage, this.i18n, this.discordClient);
                    }
                });
            }, interval);
        });
    },
    retrieveSupportCategory: function () {
        /* We don't keep track of the guild ID, but we can find it by looking for the support channel in all guilds */
        let supportCategory = null;
        this.discordClient.guilds.cache.forEach(guild => {
            const matchedChannel = guild.channels.cache.get(this.config.support.category);
            if (matchedChannel) {
                supportCategory = matchedChannel;
            }
        });
        return supportCategory;
    },
    retrieveLastMessage: async function (channel) {
        const lastMessage = await channel.messages.fetch({limit: 1});
        if (!lastMessage || !lastMessage.first()) {
            return null;
        }
        return lastMessage.first();
    }
});
