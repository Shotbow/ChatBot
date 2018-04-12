const Dependant = require('./Dependant');

module.exports = Dependant.extend({
    discordClient: null,
    dependencies: {
        'discordClient': 'discordClient',
    },
    initialize: function (dependencyGraph) {
        this._super(dependencyGraph);
    }
});
