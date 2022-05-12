module.exports = {
    isBot: function (discordClient, id) {
        return id === discordClient.user.id;
    },
    isPostedByBot: function (discordClient, message) {
        return message.author.id === discordClient.user.id;
    },
};
