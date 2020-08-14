const config = require('config');

module.exports = {
    hasRole: function (member, roleName) {
        return member.roles.cache.has(member.guild.roles.cache.find(role => role.name === roleName).id)
    },
    hasOneOfRoles: function (member, roleIds) {
        return roleIds.some(roleId => member.roles.cache.has(roleId));
    },
    isMuted: function (member) {
        return member.roles.cache.has(config.mutedRole);
    },
    isAdministrator: function (member) {
        return Object.keys(config.administratorRoles)
            .some(administratorRole => member.roles.cache.has(config.administratorRoles[administratorRole]));
    }
}
