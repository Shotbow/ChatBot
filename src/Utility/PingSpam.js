const BotModule = require('../BotModule');
const Discord = require("discord.js");

module.exports = BotModule.extend({
    config: null,
    dependencies: {
        'config': 'config',
        'i18n': 'i18n'
    },
    counts: {},
    cooldown: [],
    initialize: function (dependencyGraph) {
        this._super(dependencyGraph);
        this.discordClient.on('message', (message) => {
            if (!message.guild) return; // People can DM the bot, in which case guild == null
            if (!message.member) return; // Some messages don't appear to have a member connected to it

            /* If the member is already on cooldown, delete their message */
            const id = message.member.user.id;
            if (this.cooldown.indexOf(id) > -1) {
                message.delete();
                return;
            }

            /* If there are no pings in this message, ignore it */
            const amountOfPings = message.mentions.users.size
            if (amountOfPings === 0) {
                return;
            }
            this.counts[id] ? this.counts[id] += amountOfPings : this.counts[id] = amountOfPings;

            /* If the user has exceeded the ping threshold, put them on cooldown */
            if (this.counts[id] >= this.config.pingspam.threshold) {
                this.cooldown.push(id);
                this.notifyVictimMuted(message, this.config, this.i18n, this.discordClient);
                this.notifyModerationChannel(message, this.config, this.i18n, this.discordClient);

                setTimeout(() => {
                    this.cooldown.splice(this.cooldown.indexOf(id), 1);
                    this.notifyVictimUnmuted(message, this.config, this.i18n, this.discordClient);
                }, this.config.pingspam.cooldown);
            }

            /* Set a timeout to remove the amount of pings again after the threshold expired */
            setTimeout(() => {
                let previousAmountOfPings = this.counts[message.member.user.id];
                if (previousAmountOfPings) {
                    previousAmountOfPings - amountOfPings <= 0
                        ? delete this.counts[message.member.user.id]
                        : this.counts[message.member.user.id] -= amountOfPings;
                }
            }, this.config.pingspam.timespan);
        });
    },
    notifyVictimMuted: function (message, config, i18n, discordClient) {
        message.member.user.send({
            embed: {
                color: 0xff0000,
                author: {
                    name: discordClient.user.username,
                    icon_url: discordClient.user.displayAvatarURL()
                },
                title: i18n.__mf("You are on a temporary cooldown on the Shotbow Discord"),
                fields: [
                    {
                        name: i18n.__mf("Cooldown Reason"),
                        value: i18n.__mf("Excessive pinging of other members.")
                    },
                    {
                        name: i18n.__mf("Expiration"),
                        value: i18n.__mf("You can talk again in {cooldown} seconds.", {cooldown: config.pingspam.cooldown / 1000})
                    }
                ],
                timestamp: new Date(),
                footer: {
                    icon_url: discordClient.user.displayAvatarURL(),
                    text: "Shotbow Chat Bot"
                }
            }
        })
            .catch(() => {
                message.guild.channels.find('id', config.moderationLogsRoom).send(i18n.__mf('In addition, I was unable to DM the user about their mute. It is likely that they have DMs disabled.'))
                    .catch(() => {
                        console.log("Not enough permissions to send a message to the moderation room.");
                    });
            });
    },
    notifyVictimUnmuted: function (message, config, i18n, discordClient) {
        message.member.user.send({
            embed: {
                color: 0x66ff00,
                author: {
                    name: discordClient.user.username,
                    icon_url: discordClient.user.displayAvatarURL()
                },
                title: i18n.__mf("You can talk again on the Shotbow Discord"),
                fields: [
                    {
                        name: i18n.__mf("Friendly Reminder"),
                        value: i18n.__mf("Do not use pings excessively. If you are caught again, you can risk a permanent mute.")
                    }
                ],
                timestamp: new Date(),
                footer: {
                    icon_url: discordClient.user.displayAvatarURL(),
                    text: "Shotbow Chat Bot"
                }
            }
        })
            .catch(() => {
                message.guild.channels.cache.get(this.config.moderationLogsRoom).send(i18n.__mf('In addition, I was unable to DM the user about their unmute. It is likely that they have DMs disabled.'))
                    .catch(() => {
                        console.log("Not enough permissions to send a message to the moderation room.");
                    });
            });
    },
    notifyModerationChannel: function (message, config, i18n, discordClient) {
        message.guild.channels.cache.get(config.moderationLogsRoom).send({
            embed: {
                color: 0xff0000,
                title: i18n.__mf("@{username}#{discriminator} was put on cooldown after excessive pinging", {
                    username: message.author.username,
                    discriminator: message.author.discriminator
                }),
                timestamp: new Date(),
                description: 'Channel: ' + message.channel,
                footer: {
                    icon_url: discordClient.user.displayAvatarURL(),
                    text: "Shotbow Chat Bot"
                }
            }
        })
            .catch(() => console.log("Not enough permissions to send a message to the moderation room."));
    }
});
