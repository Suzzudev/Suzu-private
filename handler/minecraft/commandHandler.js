const networth = require('./commands/networth');
const bitches = require('./commands/bitches');
const weight = require('./commands/weight');
const enter = require('./events/partyEvents/CataEnter');

module.exports = {
    networth: async function(username, bot) {
        networth.run(username, bot);
    },

    bitches: async function(username, bot) {
        bitches.run(username, bot);
    },

    weight: async function(username, bot, chat) {
        weight.run(username, bot, chat);
    },

    cataEnter: async function(bot) {
        enter.run(bot);
    }
}