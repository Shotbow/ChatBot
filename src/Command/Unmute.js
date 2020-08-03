const Command = require('../Command');
const RoleHelper = require('../Helper/RoleHelper');

module.exports = Command.extend({
    commandName: 'unmute',
    commandAliases: ['unban'],
    advertisable: false,
    processMessage: function (message, tokens) {
        if (!RoleHelper.isAdministrator(message.member)) {
            return;
        }

        message.delete().catch(() => {});

        let victim = message.mentions.members.first();

        if (tokens.length < 3 || !victim) {
            message.member.user.send(this.i18n.__mf('Please use the correct format: `{command} <@User#9999> <Reason>`.', {command: tokens[0]}));
            return;
        }

        let reason = tokens.slice(2).join(' ');

        if (!reason || reason === '' || reason == null) {
            message.member.user.send(this.i18n.__mf('Please use the correct format: `{command} <@User#9999> <Reason>`.', {command: tokens[0]}));
            return;
        }

        message.guild.channels.cache.get(this.config.moderationLogsRoom).send({
            embed: {
                color: 0x66ff00,
                author: {
                    name: message.member.user.username,
                    icon_url: message.member.user.displayAvatarURL()
                },
                title: this.i18n.__mf("Unmuted @{username}#{discriminator}", {username: victim.user.username, discriminator: victim.user.discriminator}),
                fields: [
                    {
                        name: this.i18n.__mf("Unmute Reason"),
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
                color: 0x66ff00,
                author: {
                    name: this.discordClient.user.username,
                    icon_url: this.discordClient.user.displayAvatarURL()
                },
                title: this.i18n.__mf("Successfully unmuted @{username}#{discriminator}", {username: victim.user.username, discriminator: victim.user.discriminator}),
                fields: [
                    {
                        name: this.i18n.__mf("Unmute Reason"),
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

        victim.roles.remove(this.config.mutedRole)
            .catch(error => {
                message.guild.channels.cache.get(this.config.moderationLogsRoom).send(this.i18n.__mf('In addition, I was unable to remove their `Muted` role for some reason. My permissions may be messed up. Please contact a developer immediately.\n**Error: ** ```{error}```', {error: error}))
                    .catch(() => {
                        console.log("Not enough permissions to send a message to the moderation room.");
                    });
            });

        victim.user.send({
            embed: {
                color: 0x66ff00,
                author: {
                    name: this.discordClient.user.username,
                    icon_url: this.discordClient.user.displayAvatarURL()
                },
                title: this.i18n.__mf("You have been unmuted on the Shotbow Discord"),
                fields: [
                    {
                        name: this.i18n.__mf("Friendly Reminder"),
                        value: this.i18n.__mf("This is your last chance. If you are muted again, your appeal will not be considered.")
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
                message.guild.channels.cache.get(this.config.moderationLogsRoom).send(this.i18n.__mf('In addition, I was unable to DM the user about their unmute. It is likely that they have DMs disabled.'))
                    .catch(() => {
                        console.log("Not enough permissions to send a message to the moderation room.");
                    });
            });
    }
});
