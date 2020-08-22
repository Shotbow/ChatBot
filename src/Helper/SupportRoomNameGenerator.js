const crypto = require('crypto');

const generateRoomName = (typeKey) => {
    return `support-${typeKey}-${crypto.randomBytes(4).toString('hex')}`
}

module.exports = generateRoomName;
