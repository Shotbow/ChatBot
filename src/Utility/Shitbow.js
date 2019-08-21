const BotModule = require('../BotModule');

module.exports = BotModule.extend({
    initialize: function (dependencyGraph) {
        this._super(dependencyGraph);
        this.discordClient.on('message', message => {
            switch(true) {
                case message.content.replace(/\s/g,'').toLowerCase().match(/([s5ｓ]+(ｈ|h|\|\-\|n)+[ｉi1|]+[ｔt7]+|[ｋk]+[uｕ]+[ｓs5]+[ｏo0]+|クソ|ｸｿ|シット|しっと)+(([ｂb8]|\|3)+[ｏo0]+[wｗ]+|弓|ボウ|ぼう)+/) !== null:
                // General swear filters
                case message.content.toLowerCase().match(/(?<!mi)[s\$5ｓ]+(ｈ|h|\|\-\|n)+[ｉi1|]+[ｔt7]+(?!(tah|tim|ake))/) !== null:
                case message.content.toLowerCase().match(/[fｆ]+[uｕ]+[cｃ]+[ｋk]+/) !== null:
                    message.delete();
            }
        });
    }
});
