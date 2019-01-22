const BotModule = require('../BotModule');

module.exports = BotModule.extend({
    initialize: function (dependencyGraph) {
        this._super(dependencyGraph);
        this.discordClient.on('message', message => {
            if (message.content.replace(/\s/g,'').toLowerCase().match(/([s5ｓ]+(ｈ|h|\|\-\|n)+[ｉi1|]+[ｔt7]+|[ｋk]+[uｕ]+[ｓs5]+[ｏo0]+|クソ|ｸｿ)+(([ｂb8]|\|3)+[ｏo0]+[wｗ]+|弓)+/) !== null) message.delete();
        });
    }
});
