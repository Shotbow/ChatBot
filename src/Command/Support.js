const Command = require('../Command');
const GameHelper = require('../Helper/GameHelper');
const crypto = require('crypto');

const messages = {
    'errorBadGame': 'Hmm... I couldn\'t find a game called `{game}`. Try again?',
    'roomCreated': 'I\'ve created a general support room and added you to it!',
    'roomCreatedGame': 'I\'ve created a support room for `{game}` and added you to it!',
    'help': 'You can use `!support` or `!support <game>` to create a room where you can contact the staff team for support in private.\nYou can also execute this command in a game-specific channel to create a room for that game in specific, if that game supports it.',
    'supportWelcome': 'Hello {user}! I have created this room for you to ask a question to the staff team in private. Before asking your question, please read through the support rules below.',
    'supportWelcomeGame': 'Hello {user}! I have created this room for you to ask a question relating to `{game}` to the staff team in private. Before asking your question, please read through the support rules below.',
    'supportRules': '**• Do not ping staff**\n' +
        'Members of our team (believe it or not) have lives of their own, and being disturbed whilst working or while in class can be very frustrating, so please refrain from pinging any staff without very good cause.  If there\'s a forum thread you can use, it is not good cause to ping staff.\n' +
        '\n' +
        '**• Don\'t expect live support on this server**\n' +
        'Shotbow does not offer live support. Should you be in luck, and a member of staff is actively chatting at the time you have a matter to raise, you may of course ask them for help. Under no conditions should you ping staff members individually for help.\n' +
        '\n' +
        '**• Cheaters**\n' +
        'If someone is cheating use the /report command.  This is the best way to get the attention of staff currently active in patrol duty.  Hackusations are not allowed, and staff should not be pinged to deal with cheaters.\n' +
        '\n' +
        '**• Exception: MineZ Support\n**' +
        'The MineZ staff is happy to help with the following issues: Stuck in a block; Broken dungeons; Death due to cheaters, bugs, and broken dungeons.  To get their attention ping the role @MineZ Support and clearly state your issue and IGN, otherwise you will not receive an answer back.  No staff should be individually pinged.\n' +
        '\n' +
        'If you have a question or issue that doesn\'t require the attention of a staff member, it\'s probably better to ask politely in #shotbow without a ping and someone will gladly help you get to where you need to be.\n' +
        '\n' +
        'If your question or issue has been resolved or you are no longer in need of this channel, you can close it by using `!support close` in this channel.'
};

module.exports = Command.extend({
    commandName: 'support',
    processMessage: async function (message, tokens) {
        tokens.shift();

        /* Handle the unique cases of "help" and "close" */
        if (tokens.length > 0) {
            if (tokens[0].toLowerCase() === 'help') {
                return message.channel.send(messages.help);
            }
            if (tokens[0].toLowerCase() === 'close') {
                return message.channel.send("Closing channel...");
            }
        }

        let gameKey;
        if (tokens.length > 0) {
            gameKey = GameHelper.getKeyFromText(tokens[0])
            if (!gameKey) {
                return message.channel.send(this.i18n.__mf(messages.errorBadGame, {game: tokens[0]}));
            }
        } else {
            gameKey = GameHelper.getKeyFromChannel(message.channel);
            if (!gameKey) {
                gameKey = "all";
            }
        }

        /* Get the correct support rank as well as the support category */
        const supportRoleId = this.getSupportRank(gameKey);

        /* Create the channel and add the correct people to it */
        const supportChannel = await message.guild.channels.create(this.generateRoomName(), {
            type: 'text',
            parent: supportCategory,
        }).then(channel => channel.lockPermissions()).then(channel => channel.updateOverwrite(message.author.id, {
            ADD_REACTIONS: true,
            ATTACH_FILES: true,
            EMBED_LINKS: true,
            READ_MESSAGE_HISTORY: true,
            SEND_MESSAGES: true,
            USE_EXTERNAL_EMOJIS: true,
            SEND_TTS_MESSAGES: true,
            VIEW_CHANNEL: true
        })).then(channel => channel.updateOverwrite(supportRoleId, {
            ADD_REACTIONS: true,
            ATTACH_FILES: true,
            EMBED_LINKS: true,
            READ_MESSAGE_HISTORY: true,
            SEND_MESSAGES: true,
            USE_EXTERNAL_EMOJIS: true,
            SEND_TTS_MESSAGES: true,
            VIEW_CHANNEL: true
        }));

        if (supportRoleId === this.config.games.supportRoles['all']) {
            await supportChannel.send(this.i18n.__mf(messages.supportWelcome, {user: `<@${message.author.id}>`}));
            await supportChannel.send(this.i18n.__mf(messages.supportRules));
            return message.channel.send(this.i18n.__mf(messages.roomCreated))
        } else {
            await supportChannel.send(this.i18n.__mf(messages.supportWelcomeGame, {
                user: `<@${message.author.id}>`,
                game: this.config.games.names[gameKey]
            }));
            await supportChannel.send(this.i18n.__mf(messages.supportRules));
            return message.channel.send(this.i18n.__mf(messages.roomCreatedGame, {game: this.config.games.names[gameKey]}))
        }
    },
    getSupportRank: function (gameKey) {
        let supportRoleId = this.config.games.supportRoles[gameKey];
        if (!supportRoleId) {
            supportRoleId = this.config.games.supportRoles['all'];
        }
        return supportRoleId;
    },
    getSupportCategory: async function (guild) {
        let category = guild.channels.cache.find(channel => channel.name === this.config.supportCategory);
        if (!category) {
            category = await guild.channels.create(this.config.supportCategory, {
                type: 'category',
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone.id,
                        deny: [
                            "SEND_MESSAGES",
                            "READ_MESSAGE_HISTORY",
                            "VIEW_CHANNEL",
                            "USE_EXTERNAL_EMOJIS",
                            "EMBED_LINKS",
                            "ATTACH_FILES",
                            "ADD_REACTIONS",
                            "CREATE_INSTANT_INVITE",
                            "MANAGE_CHANNELS",
                            "MANAGE_ROLES",
                            "MANAGE_WEBHOOKS",
                            "SEND_TTS_MESSAGES",
                            "MANAGE_MESSAGES",
                            "MENTION_EVERYONE"
                        ]
                    }
                ]
            });
        }
        return category;
    },
    generateRoomName: function () {
        return `support-${crypto.randomBytes(4).toString('hex')}`
    }
});
