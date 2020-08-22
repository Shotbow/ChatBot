const config = require('config');

const generateRoomName = require('./SupportRoomNameGenerator');
const parseRoomType = require('./SupportRoomTypeParser');
const timeoutPromise = require('./TimeoutPromise');

const messages = {
    'roomConverted': 'I\'ve converted this room\'s support type from `{oldType}` to `{newType}`.',
    'roomConversionTimeout': 'Sorry, I could not rename the channel and thus not convert the support room\'s type. This could be caused by Discord rate limiting me. Try again in a few minutes!',
    'roomConversionSameType': 'Hey! This support room is already of type `{type}`.',
    'roomConversionParseError': 'Sorry, I could not parse the support room type from its name. Was it maybe renamed?',
    'roomConversionNotEnoughArguments': 'You haven\'t provided me with a type to convert to! Use `!support convert <type>` instead.',
    'roomConversionUnknownType': 'Sorry, I cannot convert this room to support type `{type}` as that type does not exist.'
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

module.exports = convertRoom;
