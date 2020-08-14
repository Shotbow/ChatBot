const moment = require('moment-timezone');
const fs = require('fs').promises;

const archiveDirectory = './archive';

const getChannelLog = async (channel) => {
    /* Get the file descriptor and open it */
    const file = await openLogFile(channel);

    /* Fetch all messages and write them to the file */
    const messages = (await fetchAllMessages(channel))
        .map(convertMessageToLogMessage)
        .reverse();
    for (const message of messages) {
        await file.write(`${message}\n`);
    }

    /* Close the file descriptor and return the file name */
    await closeLogFile(file);
    return getLogFileName(channel);
}

const fetchAllMessages = async (channel) => {
    let lastMessage = (await channel.messages.fetch({limit: 1})).array();
    if (lastMessage.length === 0) {
        return [];
    }
    let lastMessageId = lastMessage[0].id;
    let messageChunk = null;

    const messages = [];
    do {
        messageChunk = await channel.messages.fetch({limit: 100, before: lastMessageId});
        if (messageChunk.first()) {
            lastMessageId = messageChunk.last().id;
            messages.push(...messageChunk.array());
        }
    } while (messageChunk.first());

    return messages;
}

const convertMessageToLogMessage = (message) => {
    const attachmentUrls = message.attachments.map(attachment => attachment.url);
    const attachmentPart = attachmentUrls.length > 0 ? ` - attachments: ${attachmentUrls.join(', ')}` : "";
    const timestamp = moment(message.createdAt).tz('UTC').toISOString();
    return `${timestamp} - <@${message.author.id}> (${message.author.username}) - ${message.content}${attachmentPart}`;
}

const getLogFileName = (channel) => {
    return `${archiveDirectory}/${channel.name}.log`;
}

const openLogFile = async (channel) => {
    await createArchiveDirectory();
    const fileName = getLogFileName(channel);
    return fs.open(fileName, 'w');
}

const closeLogFile = async (fd) => {
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

module.exports = getChannelLog;
