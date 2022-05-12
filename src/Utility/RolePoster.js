const BotModule = require("../BotModule");
const BotDeterminer = require("../Helper/BotDeterminer");
const ChannelRetriever = require("../Helper/ChannelRetriever");
const RoleRetriever = require("../Helper/RoleRetriever");

const localizedMessages = {
    notificationRoleInfo:
        "React to the messages below to enable notifications for your favorite gamemodes!\n_You can disable notifications again using `!notifyremove <gamemode>`_",
    notificationRole: "React to get notifications for `{gamemode}`",
};

module.exports = BotModule.extend({
    config: null,
    dependencies: {
        config: "config",
        i18n: "i18n",
    },
    initialize: function (dependencyGraph) {
        this._super(dependencyGraph);

        this.discordClient.once("ready", async () => {
            /* Fetch all configuration */
            const guild = this.discordClient.guilds.cache.first();
            const notificationChannelId = this.config.notificationRoom;
            if (!notificationChannelId) {
                return;
            }
            const notificationChannel = ChannelRetriever.retrieveChannel(guild, notificationChannelId);
            if (!notificationChannel) {
                return;
            }
            const notificationRoleConfig = this.config.notificationRoles;
            if (!notificationRoleConfig) {
                return;
            }
            const notificationRoleIds = Object.keys(notificationRoleConfig).map((name) => notificationRoleConfig[name]);
            const nameMappedNotificationRoleIds = Object.keys(notificationRoleConfig).reduce((acc, name) => {
                acc[notificationRoleConfig[name]] = name;
                return acc;
            }, {});
            const notificationRoles = RoleRetriever.retrieveRoles(guild, notificationRoleIds);
            if (!notificationRoles) {
                return;
            }

            /* Delete all previous messages posted by the bot in the notification channel */
            const messages = await notificationChannel.messages.fetch({ limit: 50 });
            await Promise.all(
                messages.map(async (message) => {
                    if (BotDeterminer.isPostedByBot(this.discordClient, message)) {
                        await message.delete();
                    }
                })
            );

            /* Post new messages for every notification role with a reaction listener */
            await notificationChannel.send(this.i18n.__mf(localizedMessages.notificationRoleInfo));
            await notificationChannel.send("** **");
            const roleMessages = [];
            for (const role of notificationRoles) {
                const message = await notificationChannel.send(
                    this.i18n.__mf(localizedMessages.notificationRole, { gamemode: nameMappedNotificationRoleIds[role.id] })
                );
                await message.react("📨");
                roleMessages.push({ messageId: message.id, role });
            }
            this.discordClient.on("messageReactionAdd", async (event, user) => {
                const messageId = event.message.id;
                const roleMessage = roleMessages.find((roleMessage) => roleMessage.messageId === messageId);
                if (!roleMessage || BotDeterminer.isBot(this.discordClient, user.id)) {
                    return;
                }
                const member = await guild.members.fetch(user.id);
                await member.roles.add(roleMessage.role);
                await event.users.remove(user.id);
                await event.message.react("📨");
            });
        });
    },
});
