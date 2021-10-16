const Command = require("../Command");

const MAX_TIMEFRAME = 60 * 60 * 1000; // 5 minutes

module.exports = Command.extend({
    commandName: "massban",
    advertisable: false,
    dependencies: {
        writeToLog: "writeToLog",
        RoleDeterminer: "RoleDeterminer",
    },
    processMessage: async function (message, tokens) {
        if (!this.RoleDeterminer.isAdministrator(message.member)) {
            return;
        }

        if (message.channel.id != this.config["moderationRoom"]) {
            return;
        }

        /* Parse the system channel */
        const channel = message.guild.systemChannel;
        if (!channel) {
            message.channel.send("Unable to find system channel. Is it configured, and do I have access to it?");
            return;
        }

        /* Validate the amount of arguments */
        if (tokens.length < 2) {
            message.channel.send(
                "Not enough arguments passed. Usage: `!massban from to`, where `from` and `to` are the IDs of the welcome messages in the system channel"
            );
            return;
        }

        /* Fetch the messages and check their times in between */
        const fromId = tokens[1],
            toId = tokens[2];
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
            message.channel.send("Time between `from` and `to` exceeds maximum allowed time of 5 minutes");
            return;
        }

        /* Process the first and last message */
        let userIds = [];
        if (startMessage.type === "GUILD_MEMBER_JOIN") {
            userIds.push(startMessage.author.id);
        }
        if (endMessage.type === "GUILD_MEMBER_JOIN") {
            userIds.push(startMessage.author.id);
        }

        /* Process all other messages */
        let lastMessage = startMessage;
        message.channel.send("Fetching welcome messages, this can take some time...");
        do {
            let resolvedMessages = await channel.messages.fetch({
                after: lastMessage.id,
                limit: 100,
            });

            resolvedUserIds = resolvedMessages
                .filter((m) => m.createdTimestamp < endMessage.createdTimestamp)
                .filter((message) => message.type === "GUILD_MEMBER_JOIN")
                .map((message) => message.author.id);
            userIds = userIds.concat(resolvedUserIds);

            lastMessage = resolvedMessages.size == 0 ? null : resolvedMessages.first();
        } while (lastMessage != null && lastMessage.createdTimestamp < endMessage.createdTimestamp);

        if (userIds.length == 0) {
            message.channel.send("Found no welcome messages");
            return;
        }

        message.channel.send(
            `Found ${userIds.length} people that joined the server in the given timespan, going to ban the members...`
        );

        /* Ban the members */
        const memberManager = message.guild.members;
        let membersToBan = [];
        for (userId of userIds) {
            try {
                const member = await memberManager.fetch(userId);
                if (member) {
                    membersToBan.push(member);
                    await member.ban({ days: 7, reason: "Possible compromised account (botnet)" });
                }
            } catch (error) {
                message.channel.send(`Failed to fetch and/or ban user with ID ${userId}, continuing...`);
            }
        }

        /* Create log file and send it */
        await message.channel.send(
            `Banned ${userIds.length} users. See the attached log file for the total set of banned users`
        );
        const logFile = await this.writeToLog(
            "massbans",
            membersToBan.map((member) => `${member.user.tag} (${member.id})`)
        );
        await message.channel.send({ files: [logFile] });
    },
});
