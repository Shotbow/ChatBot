const config = require('config');

const parseRoomType = (roomName) => {
    /* Split on the dashes in the room name */
    const splitRoomName = roomName.split("-");
    if (splitRoomName.length < 2) {
        return null;
    }

    /* Fetch the type from the second entry in the split array and validate it */
    const typeKey = splitRoomName[1];
    if (!config.support.types[typeKey]) {
        return null;
    }

    return typeKey;
}

module.exports = parseRoomType;
