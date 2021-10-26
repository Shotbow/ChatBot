const timeoutPromise = require('./TimeoutPromise');

const messages = {
    'lockingRoom': 'Locking this room, making it not close automatically after inactivity.',
    'unlockingRoom': 'Unlocking this room, making it automatically close after inactivity.',
    'timedOut': 'Could not (un)lock channel at this time. Try again in a bit!'
}

const switchRoomLock = async (message, i18n) => {
    const channelName = message.channel.name;
    const isLocked = channelName.split("-").length === 4;
    if (isLocked) {
        try {
            await renameChannel(message.channel, baseChannelName(channelName));
            return message.channel.send(i18n.__mf(messages.unlockingRoom));
        } catch {
            return message.channel.send(i18n.__mf(messages.timedOut));
        }
    } else {
        try {
            await renameChannel(message.channel, `${channelName}-l`);
            return message.channel.send(i18n.__mf(messages.lockingRoom));
        } catch {
            return message.channel.send(i18n.__mf(messages.timedOut));
        }
    }
}

const baseChannelName = (name) => {
    const nameParts = name.split("-");
    if (nameParts.length === 4) {
        nameParts.pop();
        return nameParts.join('-');
    } else {
        return name;
    }
}

const renameChannel = async (channel, name) => {
    return timeoutPromise(channel.setName(name), 5000);
}

module.exports = switchRoomLock;
