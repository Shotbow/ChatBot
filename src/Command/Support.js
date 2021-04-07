const config = require('config'); // Explicit import is necessary here for command aliases

const Command = require('../Command');
const RoleDeterminer = require('../Helper/RoleDeterminer');
const generateRoomName = require('../Helper/SupportRoomNameGenerator');
const parseRoomType = require('../Helper/SupportRoomTypeParser');
const convertRoom = require('../Helper/SupportRoomConverter');
const archiveRoom = require('../Helper/SupportRoomArchiver');

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
    'noPermission': 'Sorry, it appears that you do not have access to perform this action.',
    'noIgnProvided': 'It looks like you forgot to add your Minecraft username to the support command. Usage: `!{command} <IGN>`, where `<IGN>` refers to your Minecraft username.',
    'noIgnProvidedWithType': 'It looks like you forgot to add your Minecraft username to the support command. Usage: `!{command} {type} <IGN>`, where `<IGN>` refers to your Minecraft username.',
    'notASupportRoom': 'You can only execute this command in a support room.',
    'roomCreationError': 'Sorry, it appears that I have encountered an error whilst trying to create a room. Check back later!',
    'supportWelcome': 'Hello {user} (IGN: {IGN})! I have created this room for you to ask a question relating to `{type}` to the staff team in private. Before asking your question, please read through the support rules below.',
    'supportRules': '**• Do not ping staff**\nMembers of our team (believe it or not) have lives of their own, and being disturbed whilst working or while in class can be very frustrating, so please refrain from pinging any staff without very good cause. If there\'s a forum thread you can use, it is not good cause to ping staff.\n\n**• Don\'t expect live support on this server**\nShotbow does not offer live support. Should you be in luck, and a member of staff is actively chatting at the time you have a matter to raise, you may of course ask them for help. Under no conditions should you ping staff members individually for help.\n\n**• Cheaters**\nIf someone is cheating use the /report command. This is the best way to get the attention of staff currently active in patrol duty. Hackusations are not allowed, and staff should not be pinged to deal with cheaters.\n\nIf you have a question or issue that doesn\'t require the attention of a staff member, it\'s probably better to ask politely in #shotbow without a ping and someone will gladly help you get to where you need to be.\n',
    'supportMessageReceived': 'Thank you for your message! If you have more information, you can continue sending messages in this channel. A staff member will get to you soon. ({roles})'
};

module.exports = Command.extend({
    shouldDeleteMessage: true,
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
        if (tokens.length > 0
            && commandParameters.command === 'support'
            && (tokens[0].toLowerCase() === 'close' || tokens[0].toLowerCase() === 'convert')) {
            const typeKey = parseRoomType(message.channel.name);
            if (!typeKey) {
                return message.channel.send(this.i18n.__mf(messages.notASupportRoom));
            }

            const roleIds = this.config.support.types[typeKey].roles.map(role => role.id);
            if (!RoleDeterminer.hasOneOfRoles(message.member, roleIds)) {
                return message.channel.send(this.i18n.__mf(messages.noPermission));
            }

            if (tokens[0].toLowerCase() === 'close') {
                return await archiveRoom(message, this.i18n, this.discordClient);
            }
            if (tokens[0].toLowerCase() === 'convert') {
                return await convertRoom(message, tokens, this.i18n, this.discordClient);
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

        /* Create the channel and add the correct people to it */
        const supportCategory = message.guild.channels.cache.get(this.config.support.category);
        const supportChannel = await message.guild.channels.create(generateRoomName(typeKey), {
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
                SEND_TTS_MESSAGES: false,
                VIEW_CHANNEL: true
            }))
            .then(async channel => {
                for (const supportRole of type.roles) {
                    await channel.updateOverwrite(supportRole.id, {
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
                if (supportChannel) {
                    supportChannel.delete().catch(() => {});
                }
                return message.channel.send(this.i18n.__mf(messages.roomCreationError));
            });

        const welcomeMessage = await supportChannel.send(this.i18n.__mf(messages.supportWelcome, {
            user: `<@${message.author.id}>`,
            IGN: commandParameters.ign,
            type: typeKey
        }));

        /* Add the collector to deal with post-creation events */
        this.addCollector(supportChannel, type, message.member, welcomeMessage);

        await supportChannel.send(this.i18n.__mf(messages.supportRules));
        return message.channel.send(this.i18n.__mf(messages.roomCreated, {type: typeKey}));
    },
    addCollector: function (supportChannel, supportType, creator, welcomeMessage) {
        const collectorFilter = (message) => message.member.id === creator.id;
        
        let collector;
        if (!supportType.autoClose || !supportType.autoClose.closing 
            || supportType.autoClose.closing < 0) {
            collector = supportChannel.createMessageCollector(collectorFilter);
        } else {
            const automaticDelete = supportType.autoClose.closing;
            collector = supportChannel.createMessageCollector(collectorFilter,
                {time: automaticDelete});
            collector.on('end', async (_, reason) => {
                if (reason === 'time') {
                    await archiveRoom(welcomeMessage, this.i18n, this.discordClient);
                }
            });
        }

        collector.once('collect', (message) => {
            const supportType = parseRoomType(supportChannel.name);
            const supportRoles = this.config.support.types[supportType].roles
                .filter(supportRole => supportRole.ping)
                .map(supportRole => `<@&${supportRole.id}>`)
                .join(', ');

            message.channel.send(this.i18n.__mf(messages.supportMessageReceived, {roles: supportRoles}));
            collector.stop();
        });
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
                supportType: supportType.toLowerCase(),
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
    }
});
