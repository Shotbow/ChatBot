const config = require('config');

module.exports = {
    hasRoles: function (member) {
        return member !== null && typeof member.roles !== 'undefined';
    },
    isMuted: function (member) {
        return this.hasRoles(member) && member.roles.cache.has(config.mutedRole);
    },
    isAdministrator: function (member) {
        if (!this.hasRoles(member)) {
            return false;
        }
        for (let role in config.administratorRoles) {
            if (member.roles.cache.has(config.administratorRoles[role])) {
                return true;
            }
        }
        return false;
    }
}
