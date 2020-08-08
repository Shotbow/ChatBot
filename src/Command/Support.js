const crypto = require('crypto');
const config = require('config'); // Explicit import is necessary here for command aliases

const Command = require('../Command');
const RoleDeterminer = require('../Helper/RoleDeterminer');
const timeoutPromise = require('../Helper/TimeoutPromise');
const getChannelLog = require('../Helper/ChannelLogger');

const messages = {
    'help': 'You can use `!support <type> <IGN>` to create a room where you can contact the staff team for support in private, where `<IGN>` is your Minecraft username and `<type>` is one of the following:{types}',
    'type': '\n- `{type}`: {description}',
    'unknownType': 'Unknown support type `{type}`.\n\n{help}',
    'roomCreated': 'I\'ve created a support room of type `{type}` and added you to it!',
    'roomConverted': 'I\'ve converted this room\'s support type from `{oldType}` to `{newType}`.',
    'roomClosing': 'Closing this support room...',
    'roomClosed': '{user} closed support room `{room}`',
    'supportType': 'Support type',
    'roomParticipants': 'Participants',
    'noIgnProvided': 'It looks like you forgot to add your Minecraft username to the support command. Usage: `!{command} <IGN>`, where `<IGN>` refers to your Minecraft username.',
    'noIgnProvidedWithType': 'It looks like you forgot to add your Minecraft username to the support command. Usage: `!{command} {type} <IGN>`, where `<IGN>` refers to your Minecraft username.',
    'notASupportRoom': 'You can only execute this command in a support room.',
    'roomConversionTimeout': 'Sorry, I could not rename the channel and thus not convert the support room\'s type. This could be caused by Discord rate limiting me. Try again in a few minutes!',
    'roomConversionSameType': 'Hey! This support room is already of type `{type}`.',
    'roomConversionParseError': 'Sorry, I could not parse the support room type from its name. Was it maybe renamed?',
    'roomConversionNotEnoughArguments': 'You haven\'t provided me with a type to convert to! Use `!support convert <type>` instead.',
    'roomConversionUnknownType': 'Sorry, I cannot convert this room to support type `{type}` as that type does not exist.',
    'roomCreationError': 'Sorry, it appears that I have encountered an error whilst trying to create a room. Check back later!',
    'supportWelcome': 'Hello {user} (IGN: {IGN})! I have created this room for you to ask a question relating to `{type}` to the staff team in private. Before asking your question, please read through the support rules below.',
    'supportRules': '**• Do not ping staff**\n' +
        'Members of our team (believe it or not) have lives of their own, and being disturbed whilst working or while in class can be very frustrating, so please refrain from pinging any staff without very good cause.  If there\'s a forum thread you can use, it is not good cause to ping staff.\n' +
        '\n' +
        '**• Don\'t expect live support on this server**\n' +
        'Shotbow does not offer live support. Should you be in luck, and a member of staff is actively chatting at the time you have a matter to raise, you may of course ask them for help. Under no conditions should you ping staff members individually for help.\n' +
        '\n' +
        '**• Cheaters**\n' +
        'If someone is cheating use the /report command.  This is the best way to get the attention of staff currently active in patrol duty.  Hackusations are not allowed, and staff should not be pinged to deal with cheaters.\n' +
        '\n' +
        'If you have a question or issue that doesn\'t require the attention of a staff member, it\'s probably better to ask politely in #shotbow without a ping and someone will gladly help you get to where you need to be.\n'
};

module.exports = Command.extend({
    commandName: 'support',
    commandAliases: Object.keys(config.support.types).map(typeKey => `${typeKey}support`),
    processMessage: async function (message, tokens) {
        const commandParameters = this.extractParameters(tokens);

        /* Handle the case of no or invalid arguments provided */
        if (!commandParameters) {
            const types = Object.keys(this.config.support.types).map(type => this.i18n.__mf(messages.type, {
                type,
                description: this.config.support.types[type].description
            }));
            return message.channel.send(this.i18n.__mf(messages.help, {types}));
        }

        /* Handle the unique cases of "close" and "convert" */
        tokens.shift();
        const supportCategory = message.guild.channels.cache.get(this.config.support.category);
        if (tokens.length > 0 && commandParameters.command === 'support'
            && RoleDeterminer.isAdministrator(message.member)
            && (tokens[0].toLowerCase() === 'close' || tokens[0].toLowerCase() === 'convert')) {
            if (message.channel.parent.id !== supportCategory.id) {
                return message.channel.send(this.i18n.__mf(messages.notASupportRoom));
            }

            if (tokens[0].toLowerCase() === 'close') {
                return await this.processDeletion(message, commandParameters);
            }
            if (tokens[0].toLowerCase() === 'convert') {
                return await this.processConversion(message, tokens);
            }
        }

        /* Handle the case of no username provided */
        if (!commandParameters.ign) {
            if (commandParameters.command === 'support') {
                return message.channel.send(this.i18n.__mf(messages.noIgnProvidedWithType, {
                    command: commandParameters.command,
                    type: commandParameters.supportType
                }));
            } else {
                return message.channel.send(this.i18n.__mf(messages.noIgnProvided, {
                    command: commandParameters.command
                }));
            }
        }

        /* Get the support type */
        const typeKey = commandParameters.supportType;
        const type = this.config.support.types[typeKey];
        if (!type) {
            const types = Object.keys(this.config.support.types).map(type => this.i18n.__mf(messages.type, {
                type,
                description: this.config.support.types[type].description
            }));
            const helpText = this.i18n.__mf(messages.help, {types});
            return message.channel.send(this.i18n.__mf(messages.unknownType, {type: typeKey, help: helpText}));
        }

        /* Create the channel and add the correct people to it */
        const supportChannel = await message.guild.channels.create(this.generateRoomName(typeKey), {
            type: 'text',
            parent: supportCategory,
        })
            .then(channel => channel.lockPermissions())
            .then(channel => channel.updateOverwrite(message.author.id, {
                ADD_REACTIONS: true,
                ATTACH_FILES: true,
                EMBED_LINKS: true,
                READ_MESSAGE_HISTORY: true,
                SEND_MESSAGES: true,
                USE_EXTERNAL_EMOJIS: true,
                SEND_TTS_MESSAGES: true,
                VIEW_CHANNEL: true
            }))
            .then(async channel => {
                for (const supportRoleId of type.roles) {
                    await channel.updateOverwrite(supportRoleId, {
                        ADD_REACTIONS: true,
                        ATTACH_FILES: true,
                        EMBED_LINKS: true,
                        READ_MESSAGE_HISTORY: true,
                        SEND_MESSAGES: true,
                        USE_EXTERNAL_EMOJIS: true,
                        SEND_TTS_MESSAGES: true,
                        VIEW_CHANNEL: true
                    });
                }
                return channel;
            })
            .catch(() => {
                /* If something went wrong with room creation, we delete it (if it was created) and notify the user */
                supportChannel.delete().catch(() => {
                });
                return message.channel.send(this.i18n.__mf(messages.roomCreationError));
            });

        await supportChannel.send(this.i18n.__mf(messages.supportWelcome, {
            user: `<@${message.author.id}>`,
            IGN: commandParameters.ign,
            type: typeKey
        }));
        await supportChannel.send(this.i18n.__mf(messages.supportRules));
        return message.channel.send(this.i18n.__mf(messages.roomCreated, {type: typeKey}))
    },
    processDeletion: async function (message) {
        await message.channel.send(this.i18n.__mf(messages.roomClosing));
        const logFile = await getChannelLog(message.channel);
        await message.channel.delete("Support room closed").catch(() => {});

        /* Notify the moderation channel */
        const guild = message.channel.guild;
        const logChannel = guild.channels.cache.get(this.config.moderationLogsRoom);
        if (!logChannel) {
            console.log(`Could not post log for deletion of support room \`${message.channel.name}\`: 
            invalid configuration of log channel`);
            return;
        }
        const embedMessage = await logChannel.send({
            embed: {
                color: 0x2196f3,
                author: {
                    name: this.discordClient.user.username,
                    icon_url: this.discordClient.user.displayAvatarURL()
                },
                title: this.i18n.__mf(messages.roomClosed, {
                    user: `@${message.author.username}`,
                    room: message.channel.name
                }),
                fields: [
                    {
                        name: this.i18n.__mf(messages.supportType),
                        value: this.parseRoomType(message.channel.name)
                    },
                    {
                        name: this.i18n.__mf(messages.roomParticipants),
                        value: (await this.getRoomParticipants(message.channel)).join(',')
                    }
                ],
                timestamp: new Date(),
                footer: {
                    icon_url: this.discordClient.user.displayAvatarURL(),
                    text: "Shotbow Chat Bot"
                }
            }
        });
        const fileMessage = await logChannel.send({files: [logFile]});
        return [embedMessage, fileMessage];
    },
    processConversion: async function (message, tokens) {
        const supportRoom = message.channel;
        tokens.shift();
        if (tokens.length === 0) {
            return supportRoom.send(this.i18n.__mf(messages.roomConversionNotEnoughArguments));
        }

        /* Fetch the old type */
        const oldTypeKey = this.parseRoomType(supportRoom.name);
        const oldType = this.config.support.types[oldTypeKey];
        if (!oldTypeKey) {
            return supportRoom.send(this.i18n.__mf(messages.roomConversionParseError));
        }

        /* Fetch the new type */
        const newTypeKey = tokens[0];
        const newType = this.config.support.types[newTypeKey];
        if (!newType) {
            return supportRoom.send(this.i18n.__mf(messages.roomConversionUnknownType, {type: newTypeKey}));
        }

        /* If we are switching to the same type, do nothing */
        if (oldTypeKey === newTypeKey) {
            return supportRoom.send(this.i18n.__mf(messages.roomConversionSameType, {type: newTypeKey}));
        }

        /* Rename the channel. Discord's Rate Limiting policies are really strict on this one, so we can timeout */
        let continueConversion = true;
        await timeoutPromise(supportRoom.setName(this.generateRoomName(newTypeKey)), 5000).catch(() => {
            continueConversion = false;
            return supportRoom.send(this.i18n.__mf(messages.roomConversionTimeout));
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

        return supportRoom.send(this.i18n.__mf(messages.roomConverted, {
            oldType: oldTypeKey,
            newType: newTypeKey
        }));
    },
    extractParameters: function (tokens) {
        const clonedTokens = [...tokens];
        /* Extract the support type */
        const command = clonedTokens[0].substr(this.commandPrefix.length, clonedTokens[0].length);
        clonedTokens.shift();
        let supportType;
        if (command === 'support') {
            if (clonedTokens.length === 0) {
                return null;
            } else {
                supportType = clonedTokens[0];
                clonedTokens.shift();
            }
        } else {
            supportType = command.split('support')[0];
        }

        /* Extract the IGN */
        if (clonedTokens.length === 0) {
            return {
                command,
                supportType,
                ign: null
            }
        }
        const ign = clonedTokens[0];

        /* Return the extracted data in an object */
        return {
            command,
            supportType,
            ign
        }
    },
    generateRoomName: function (typeKey) {
        return `support-${typeKey}-${crypto.randomBytes(4).toString('hex')}`
    },
    parseRoomType: function (roomName) {
        /* Split on the dashes in the room name */
        const splitRoomName = roomName.split("-");
        if (splitRoomName.length < 2) {
            return null;
        }

        /* Fetch the type from the second entry in the split array and validate it */
        const typeKey = splitRoomName[1];
        if (!this.config.support.types[typeKey]) {
            return null;
        }

        return typeKey;
    },
    getRoomParticipants: async function (channel) {
        const guild = channel.guild;
        const permissionOverwrites = channel.permissionOverwrites.array();
        const participants = [];
        for (const permissionOverwrite of permissionOverwrites) {
            await guild.members.fetch(permissionOverwrite.id)
                .then(participant => participants.push(participant))
                .catch(() => {});
        }

        return participants;
    }
});
