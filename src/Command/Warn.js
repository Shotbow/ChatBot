const Command = require('../Command');
const RoleHelper = require('../Helper/RoleHelper');

module.exports = Command.extend({
    commandName: 'warn',
    advertisable: false,
    processMessage: function (message, tokens) {
        if (!RoleHelper.isAdministrator(message.member)) {
            return;
        }

        message.delete().catch(() => {});

        let victim = message.mentions.members.first();
        if (tokens.length < 3 || !victim) {
            message.member.user.send(this.i18n.__mf('Please use the correct format: `!warn <@User#9999> <Reason>`.'));
            return;
        }
        
        if (message.member.toString() === victim.toString()) {
            message.member.user.send(this.i18n.__mf('You may not warn yourself!'));
            return;
        }
        if (RoleHelper.isAdministrator(victim)) {
            message.member.user.send(this.i18n.__mf('You may not warn another Discord administrator!'));
            return;
        }

        let reason = tokens.slice(2).join(' ');
        if (!reason || reason === '' || reason == null) {
            message.member.user.send(this.i18n.__mf('Please use the correct format: `!warn <@User#9999> <Reason>`.'));
            return;
        }

        message.guild.channels.cache.get(this.config.moderationLogsRoom).send({
            embed: {
                color: 0xff0000,
                author: {
                    name: message.member.user.username,
                    icon_url: message.member.user.displayAvatarURL()
                },
                title: this.i18n.__mf("Warned @{username}#{discriminator}", {username: victim.user.username, discriminator: victim.user.discriminator}),
                fields: [
                    {
                        name: "Warn Reason",
                        value: reason
                    }
                ],
                timestamp: new Date(),
                footer: {
                    icon_url: this.discordClient.user.displayAvatarURL(),
                    text: "Shotbow Chat Bot"
                }
            }
        })
            .catch(() => console.log("Not enough permissions to send a message to the moderation room."));
        
        message.member.user.send({
            embed: {
                color: 0xff0000,
                author: {
                    name: this.discordClient.user.username,
                    icon_url: this.discordClient.user.displayAvatarURL()
                },
                title: this.i18n.__mf("Successfully warned @{username}#{discriminator}", {username: victim.user.username, discriminator: victim.user.discriminator}),
                fields: [
                    {
                        name: this.i18n.__mf("Warn Reason"),
                        value: reason
                    }
                ],
                timestamp: new Date(),
                footer: {
                    icon_url: this.discordClient.user.displayAvatarURL(),
                    text: "Shotbow Chat Bot"
                }
            }
        })
            .catch(() => {});

        victim.user.send({
            embed: {
                color: 0xff0000,
                author: {
                    name: this.discordClient.user.username,
                    icon_url: this.discordClient.user.displayAvatarURL()
                },
                title: this.i18n.__mf("You have been warned on the Shotbow Discord"),
                fields: [
                    {
                        name: this.i18n.__mf("Warn Reason"),
                        value: reason
                    }
                ],
                timestamp: new Date(),
                footer: {
                    icon_url: this.discordClient.user.displayAvatarURL(),
                    text: "Shotbow Chat Bot"
                }
            }
        })
            .catch(() => {
                message.guild.channels.cache.get(this.config.moderationLogsRoom).send(this.i18n.__mf('In addition, I was unable to DM the user about their warning. It is likely that they have DMs disabled.'))
                    .catch(() => {
                        console.log("Not enough permissions to send a message to the moderation room.");
                    });
            });
    }
});
