const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'mute',
    commandAliases: ['ban'],
    advertisable: false,
    processMessage: function (message, tokens) {
        if (!this.memberIsAdministrator(message.member)) {
            return;
        }

        message.delete();

        let victim = message.mentions.members.first();

        if (tokens.length < 3 || !victim) {
            message.member.user.send(this.i18n.__mf('Please use the correct format: `{command} <@User#9999> <Reason>`.', {command: tokens[0]}));
            return;
        }
        
        if (message.member.toString() == victim.toString()) {
            message.member.user.send(this.i18n.__mf('You may not mute yourself!'));
            return;
        }
        if (this.memberIsAdministrator(victim)) {
            message.member.user.send(this.i18n.__mf('You may not mute another Discord administrator!'));
            return;
        }

        let reason = tokens.slice(2).join(' ');

        if (!reason || reason == '' || reason == null) {
            message.member.user.send(this.i18n.__mf('Please use the correct format: `{command} <@User#9999> <Reason>`.', {command: tokens[0]}));
            return;
        }
        
        message.member.user.send({
            embed: {
                color: 0xff0000,
                author: {
                    name: this.discordClient.user.username,
                    icon_url: this.discordClient.user.avatarURL
                },
                title: this.i18n.__mf("Successfully muted @{username}#{discriminator}", {username: victim.user.username, discriminator: victim.user.discriminator}),
                fields: [
                    {
                        name: this.i18n.__mf("Mute Reason"),
                        value: reason
                    }
                ],
                timestamp: new Date(),
                footer: {
                    icon_url: this.discordClient.user.avatarURL,
                    text: "Shotbow Chat Bot"
                }
            }
        });

        victim.user.send({
            embed: {
                color: 0xff0000,
                author: {
                    name: this.discordClient.user.username,
                    icon_url: this.discordClient.user.avatarURL
                },
                title: this.i18n.__mf("You have been muted on the Shotbow Discord"),
                fields: [
                    {
                        name: this.i18n.__mf("Mute Reason"),
                        value: reason
                    },
                    {
                        name: this.i18n.__mf("Appeal"),
                        value: this.i18n.__mf("You can appeal by going to [this link]({url}) on our Shotbow forums.", {url: 'https://shotbow.net/forum/forums/ban-appeals.22/'})
                    }
                ],
                timestamp: new Date(),
                footer: {
                    icon_url: this.discordClient.user.avatarURL,
                    text: "Shotbow Chat Bot"
                }
            }
        })
            .then(() => {
                victim.addRole(message.guild.roles.find('name', 'Muted'))
                    .catch(error => message.member.user.send(this.i18n.__mf('In addition, I was unable to grant them the `Muted` role for some reason. My permissions may be messed up. Please contact a developer immediately.\n**Error: ** ```{error}```', {error: error})));
            })
            .catch(error => message.member.user.send(this.i18n.__mf('In addition, I was unable to DM the banned user about their ban. It is likely that they have DMs disabled.')));

        message.guild.channels.find('id', this.config.moderationLogsRoom).send({
            embed: {
                color: 0xff0000,
                author: {
                    name: message.member.user.username,
                    icon_url: message.member.user.avatarURL
                },
                title: this.i18n.__mf("Muted @{username}#{discriminator}", {username: victim.user.username, discriminator: victim.user.discriminator}),
                fields: [
                    {
                        name: this.i18n.__mf("Mute Reason"),
                        value: reason
                    }
                ],
                timestamp: new Date(),
                footer: {
                    icon_url: this.discordClient.user.avatarURL,
                    text: "Shotbow Chat Bot"
                }
            }
        });
    },
    memberIsAdministrator: function (member) {
        if (member == null || typeof member.roles == 'undefined') {
            return false;
        }
        for (let role in this.config.administratorRoles) {
            if (member.roles.has(this.config.administratorRoles[role])) {
                return true;
            }
        }
        return false;
    }
});
