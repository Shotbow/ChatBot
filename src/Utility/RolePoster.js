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
            const welcomeChannelId = this.config.welcomeRoom;
            if (!welcomeChannelId) {
                return;
            }
            const welcomeChannel = ChannelRetriever.retrieveChannel(guild, welcomeChannelId);
            if (!welcomeChannel) {
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

            /* Delete all previous messages posted by the bot in the welcome channel */
            const messages = await welcomeChannel.messages.fetch({ limit: 50 });
            await Promise.all(
                messages.map(async (message) => {
                    if (BotDeterminer.isPostedByBot(this.discordClient, message)) {
                        await message.delete();
                    }
                })
            );

            /* Post new messages for every notification role with a reaction listener */
            await welcomeChannel.send(this.i18n.__mf(localizedMessages.notificationRoleInfo));
            await welcomeChannel.send("** **");
            const roleMessages = [];
            for (const role of notificationRoles) {
                const message = await welcomeChannel.send(
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
                await event.remove(); // Because there is no easy way to remove a single user's reaction in discord.js
                await event.message.react("📨");
            });
        });
    },
});
