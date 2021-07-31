const Command = require("../Command");
const RoleDeterminer = require("../Helper/RoleDeterminer");

const MAX_TIMEFRAME = 1 * 60 * 60 * 1000;

module.exports = Command.extend({
    commandName: "cleanup",
    advertisable: false,
    processMessage: async function (message, tokens) {
        if (!RoleDeterminer.isAdministrator(message.member)) {
            return;
        }

        if (message.channel.id != this.config["moderationRoom"]) {
            return;
        }

        message.delete().catch(() => {});

        /* Validate the amount of arguments */
        if (tokens.length < 3) {
            message.channel.send(
                "Not enough arguments passed. Usage: `!cleanup #channel from to`, where `from` and `to` are the IDs of the messages"
            );
            return;
        }

        /* Parse the target channel */
        const channel = message.mentions.channels.first();
        if (!channel) {
            message.channel.send("Channel not found");
            return;
        }

        /* Fetch the messages and check their times in between */
        const fromId = tokens[2],
            toId = tokens[3];
        let startMessage, endMessage;
        try {
            startMessage = await channel.messages.fetch(fromId);
            endMessage = await channel.messages.fetch(toId);
        } catch (error) {
            message.channel.send("Either the start ID or end ID is invalid");
            return;
        }

        if (
            endMessage.createdTimestamp < startMessage.createdTimestamp ||
            endMessage.createdTimestamp - startMessage.createdTimestamp > MAX_TIMEFRAME
        ) {
            message.channel.send("Time between `from` and `to` exceeds maximum allowed time of 1 hour");
            return;
        }

        let messages = null;
        let lastMessage = startMessage;
        message.channel.send("Fetching messages, this can take some time...");
        do {
            let resolvedMessages = await channel.messages.fetch({
                after: lastMessage.id,
                limit: 100,
            });

            resolvedMessages = resolvedMessages.filter((m) => m.createdTimestamp < endMessage.createdTimestamp);

            if (!messages) {
                messages = resolvedMessages;
            } else {
                messages.concat(resolvedMessages);
            }

            lastMessage = resolvedMessages.size == 0 ? null : resolvedMessages.last();
        } while (lastMessage != null && lastMessage.createdTimestamp < endMessage.createdTimestamp);

        if (messages.size > 0) {
            message.channel.send(`Found ${messages.size} messages, going to delete them now!`);
            await startMessage.delete().catch((e) => {});
            await endMessage.delete().catch((e) => {});
            await channel.bulkDelete(messages);
            message.channel.send(`Successfully deleted ${messages.size} messages in ${channel}`);
        } else {
            message.channel.send("Found no messages to delete");
        }
    },
});
