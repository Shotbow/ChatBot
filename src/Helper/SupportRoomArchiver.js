const config = require('config');

const getChannelLog = require('./ChannelLogger');
const parseRoomType = require('./SupportRoomTypeParser');

const messages = {
    'none': '*none*',
    'roomClosing': 'Closing this support room...',
    'roomClosed': '{user} closed support room `{room}`',
    'supportType': 'Support type',
    'roomParticipants': 'Participants',
}

const getRoomParticipants = async (supportRoom) => {
    const guild = supportRoom.guild;
    const permissionOverwrites = supportRoom.permissionOverwrites.array();
    const participants = [];
    for (const permissionOverwrite of permissionOverwrites) {
        await guild.members.fetch(permissionOverwrite.id)
            .then(participant => participants.push(participant))
            .catch(() => {
            });
    }

    return participants;
}

const determineLogChannel = function (message) {
    const type = parseRoomType(message.channel.name);
    let room = config.moderationLogsRoom;
    if (typeof config.support.types[type].logRoom !== 'undefined') {
        room = config.support.types[type].logRoom;
    }
    return message.channel.guild.channels.cache.get(room);
}

const archiveRoom = async (message, i18n, discordClient) => {
    await message.channel.send(i18n.__mf(messages.roomClosing));
    const logFile = await getChannelLog(message.channel);
    await message.channel.delete("Support room closed").catch(() => {
    });

    /* Notify the moderation channel */
    const logChannel = determineLogChannel(message);
    if (!logChannel) {
        console.log(`Could not post log for deletion of support room \`${message.channel.name}\`: 
            invalid configuration of log channel`);
        return;
    }

    /* Fetch all the participants and turn them into a displayable string */
    const participants = (await getRoomParticipants(message.channel))
        .filter(participant => participant.id !== discordClient.user.id)
        .map(participant => participant.displayName)
        .join(', ');

    const embedMessage = await logChannel.send({
        embed: {
            color: 0x2196f3,
            author: {
                name: discordClient.user.username,
                icon_url: discordClient.user.displayAvatarURL()
            },
            title: i18n.__mf(messages.roomClosed, {
                user: `@${message.author.username}`,
                room: message.channel.name
            }),
            fields: [
                {
                    name: i18n.__mf(messages.supportType),
                    value: parseRoomType(message.channel.name)
                },
                {
                    name: i18n.__mf(messages.roomParticipants),
                    value: participants.length === 0 ? i18n.__mf(messages.none) : participants
                }
            ],
            timestamp: new Date(),
            footer: {
                icon_url: discordClient.user.displayAvatarURL(),
                text: "Shotbow Chat Bot"
            }
        }
    });
    const fileMessage = await logChannel.send({files: [logFile]});
    return [embedMessage, fileMessage];
}

module.exports = archiveRoom;
