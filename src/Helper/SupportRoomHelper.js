const crypto = require('crypto');
const config = require('config');

const getChannelLog = require('./ChannelLogger');
const timeoutPromise = require('./TimeoutPromise');

const messages = {
    'none': '*none*',
    'roomClosing': 'Closing this support room...',
    'roomClosed': '{user} closed support room `{room}`',
    'supportType': 'Support type',
    'roomParticipants': 'Participants',
    'roomConverted': 'I\'ve converted this room\'s support type from `{oldType}` to `{newType}`.',
    'roomConversionTimeout': 'Sorry, I could not rename the channel and thus not convert the support room\'s type. This could be caused by Discord rate limiting me. Try again in a few minutes!',
    'roomConversionSameType': 'Hey! This support room is already of type `{type}`.',
    'roomConversionParseError': 'Sorry, I could not parse the support room type from its name. Was it maybe renamed?',
    'roomConversionNotEnoughArguments': 'You haven\'t provided me with a type to convert to! Use `!support convert <type>` instead.',
    'roomConversionUnknownType': 'Sorry, I cannot convert this room to support type `{type}` as that type does not exist.'
}

const generateRoomName = (typeKey) => {
    return `support-${typeKey}-${crypto.randomBytes(4).toString('hex')}`
}

const parseRoomType = (roomName) => {
    /* Split on the dashes in the room name */
    const splitRoomName = roomName.split("-");
    if (splitRoomName.length < 2) {
        return null;
    }

    /* Fetch the type from the second entry in the split array and validate it */
    const typeKey = splitRoomName[1];
    if (!config.support.types[typeKey]) {
        return null;
    }

    return typeKey;
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

const convertRoom = async (message, tokens, i18n) => {
    const supportRoom = message.channel;
    tokens.shift();
    if (tokens.length === 0) {
        return supportRoom.send(i18n.__mf(messages.roomConversionNotEnoughArguments));
    }

    /* Fetch the old type */
    const oldTypeKey = parseRoomType(supportRoom.name);
    const oldType = config.support.types[oldTypeKey];
    if (!oldTypeKey) {
        return supportRoom.send(i18n.__mf(messages.roomConversionParseError));
    }

    /* Fetch the new type */
    const newTypeKey = tokens[0];
    const newType = config.support.types[newTypeKey];
    if (!newType) {
        return supportRoom.send(i18n.__mf(messages.roomConversionUnknownType, {type: newTypeKey}));
    }

    /* If we are switching to the same type, do nothing */
    if (oldTypeKey === newTypeKey) {
        return supportRoom.send(i18n.__mf(messages.roomConversionSameType, {type: newTypeKey}));
    }

    /* Rename the channel. Discord's Rate Limiting policies are really strict on this one, so we can timeout */
    let continueConversion = true;
    await timeoutPromise(supportRoom.setName(generateRoomName(newTypeKey)), 5000).catch(() => {
        continueConversion = false;
        return supportRoom.send(i18n.__mf(messages.roomConversionTimeout));
    });
    if (!continueConversion) {
        return;
    }

    /* Remove old support roles and add new ones */
    for (const supportRoleId of oldType.roles) {
        await supportRoom.permissionOverwrites.get(supportRoleId)
            .delete('Support room type conversion')
            .catch((e) => {
                console.log(e)
            });
    }
    for (const supportRoleId of newType.roles) {
        await supportRoom.updateOverwrite(supportRoleId, {
            ADD_REACTIONS: true,
            ATTACH_FILES: true,
            EMBED_LINKS: true,
            READ_MESSAGE_HISTORY: true,
            SEND_MESSAGES: true,
            USE_EXTERNAL_EMOJIS: true,
            SEND_TTS_MESSAGES: true,
            VIEW_CHANNEL: true
        }, 'Support room type conversion').catch((e) => {
            console.log(e)
        });
    }

    return supportRoom.send(i18n.__mf(messages.roomConverted, {
        oldType: oldTypeKey,
        newType: newTypeKey
    }));
}

const archiveRoom = async (message, i18n, discordClient) => {
    await message.channel.send(i18n.__mf(messages.roomClosing));
    const logFile = await getChannelLog(message.channel);
    await message.channel.delete("Support room closed").catch(() => {
    });

    /* Notify the moderation channel */
    const guild = message.channel.guild;
    const logChannel = guild.channels.cache.get(config.moderationLogsRoom);
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

module.exports = {
    generateRoomName,
    parseRoomType,
    getRoomParticipants,
    convertRoom,
    archiveRoom
};
