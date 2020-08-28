const BotModule = require('../BotModule');
const RoleDeterminer = require('../Helper/RoleDeterminer');

const Message = {
    autoMuted: 'Muted @{username}#{discriminator} automatically upon rejoin',
    unableToAutoMute: 'I was unable to automatically mute @{username}#{discriminator}. My permissions may be messed up. Please contact a developer immediately.\\n**Error: ** ```{error}```\''
}

module.exports = BotModule.extend({
    config: null,
    dependencies: {
        'config': 'config',
        'muteRepository': 'muteRepository',
        'i18n': 'i18n'
    },
    initialize: function (dependencyGraph) {
        this._super(dependencyGraph);

        this.discordClient.on('ready', this.loadMutes.bind(this));
        this.discordClient.on('message', message => {
            if (message.member && RoleDeterminer.isMuted(message.member)) {
                message.delete();
            }
        });
        this.discordClient.on('guildMemberAdd', this.autoMute.bind(this));
    },

    loadMutes: function () {
        this.discordClient.guilds.cache.forEach(guild => {
            const role = guild.roles.cache.get(this.config.mutedRole);
            if (!role) {
                return;
            }

            role.members.forEach(member => {
                this.muteRepository.add(member.user.id);
            });
        })
    },

    autoMute: function (member) {
        const id = member.user.id;
        if (!this.muteRepository.has(id)) {
            return
        }

        member.roles.add(this.config.mutedRole)
            .catch(error => {
                member.guild.channels.cache.find(this.config.moderationLogsRoom).send(
                    this.i18n.__mf(
                        Message.unableToAutoMute,
                        {username: member.user.username, discriminator: member.user.discriminator, error: error}
                    )
                );
            })
        member.guild.channels.cache.get(this.config.moderationLogsRoom).send({
            embed: {
                color: 0xff0000,
                author: {
                    name: member.user.username,
                    icon_url: member.user.displayAvatarURL()
                },
                title: this.i18n.__mf('Muted @{username}#{discriminator}', {
                    username: member.user.username,
                    discriminator: member.user.discriminator
                }),
                fields: [
                    {
                        name: this.i18n.__mf('Mute Reason'),
                        value: this.i18n.__mf('User attempted to evade mute')
                    }
                ],
                timestamp: new Date(),
                footer: {
                    icon_url: this.discordClient.user.displayAvatarURL(),
                    text: 'Shotbow Chat Bot'
                }
            }
        });
    }
});
