const BotModule = require('../BotModule');

const ONE_MINUTE_IN_MS = 60 * 1000;

module.exports = BotModule.extend({
    config: null,
    timeout: null,
    dependencies: {
        'config': 'config'
    },
    trickcordTreatCommands :[
        'h!trick',
        'h!tricks',
        'h!treat',
        'h!treats',
        'h!leaderboard',
        'h!help',
        'h!support',
        'h!invite',
        'h!inventory'
    ],

    initialize: function (dependencyGraph) {
        this._super(dependencyGraph);

        this.discordClient.on('message', this.handleMessage.bind(this));

        this.timeout = typeof this.config.trickcordTreatDeleteTime != 'undefined' ?
            this.config.trickcordTreatDeleteTime :
            ONE_MINUTE_IN_MS;
    },

    /**
     *
     * @param {Message} message
     */
    handleMessage: function (message) {
        if (!message.guild) {
            return;
        }
        if (!message.member) {
            return;
        }

        if (typeof this.config.trickcordTreatRoom !== 'undefined'
            && message.channel.id == this.config.trickcordTreatRoom) {
            return;
        }

        const isTrickcordTreatCommand = this.trickcordTreatCommands.indexOf(message.content) >= 0;
        const isTrickcordTreatBot = message.member.id == '755580145078632508';
        if (!isTrickcordTreatBot && !isTrickcordTreatCommand) {
            return; // Not a message we care about
        }

        setTimeout(() => {
            message.delete().catch(() => {});
        }, this.timeout);
    }
});
