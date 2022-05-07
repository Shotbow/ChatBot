module.exports = {
    retrieveRole: function (guild, roleId) {
        const role = guild.roles.cache.get(roleId);
        if (role) {
            return role;
        }
    },
    retrieveRoles: function (guild, roleIds) {
        const roles = [];
        roleIds.forEach((roleId) => {
            const role = this.retrieveRole(guild, roleId);
            if (role) {
                roles.push(role);
            }
        });
        return roles;
    },
};
