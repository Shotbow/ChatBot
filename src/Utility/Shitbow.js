const BotModule = require('../BotModule');

module.exports = BotModule.extend({
	config: null,
    dependencies: {
        'config': 'config'
	},
	initialize: function (dependencyGraph) {
		this._super(dependencyGraph);
		this.discordClient.on('message', message => {
			let trimmed = message.content.replace(/\s/g,'').toLowerCase();
			for (var i in this.config.swearRegexes) {
				let regex = new RegExp(this.config.swearRegexes[i]);
				if (trimmed.match(regex)) {
					message.delete();
					return;
				}
			}
		});
	}
});
