const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'about',
    processMessage: function (message, tokens) {
        message.channel.send("Hi there! My name is **Chat Bot** and I'm an open-sourced Discord bot made specifically for Shotbow! You can view my code and contribute to me here: <https://github.com/Shotbow/DiscordChatBot>");
    }
});