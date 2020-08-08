const config = require('config');
const moment = require('moment-timezone');
const fs = require('fs').promises;

const archiveDirectory = './archive';

const logChannel = async (channel) => {
    const guild = channel.guild;
    const logChannel = guild.channels.cache.get(config.moderationLogsRoom);
    if (!logChannel) {
        console.log(`Could not create logs for channel ${channel.name}: invalid configuration of log channel`);
        return;
    }

    /* Get the file descriptor and open it */
    const file = await openFile(channel);

    const messages = (await channel.messages.fetch({limit: 100}))
        .array()
        .map(convertMessageToLogMessage)
        .reverse();
    for (const message of messages) {
        await file.write(`${message}\n`);
    }

    /* Close the file descriptor and send the file to the logs channel */
    await closeFile(file);
    return file;
}

const convertMessageToLogMessage = (message) => {
    const timestamp = moment(message.createdAt).tz('UTC').toISOString();
    const logMessage = `${timestamp} - <@${message.author.id}> (${message.author.username}) - ${message.content}`;
    logMessage.replace(/\\n/g, '\\n');
    return logMessage;
}

const openFile = async (channel) => {
    await createArchiveDirectory();
    const fileName = `${archiveDirectory}/${channel.name}.log`;
    return fs.open(fileName, 'w');
}

const closeFile = async (fd) => {
    await fd.close();
}

const createArchiveDirectory = async () => {
    await fs.mkdir(archiveDirectory)
        .catch(err => {
            if (err.code !== 'EEXIST') {
                console.log(`Could not create archive directory: ${archiveDirectory}:\n ${err}`);
            }
        });
}

module.exports = logChannel;
