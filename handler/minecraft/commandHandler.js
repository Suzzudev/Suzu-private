const networth = require('./commands/networth');
const bitches = require('./commands/bitches');
const weight = require('./commands/weight');
const parsifal = require('./commands/parsifal')
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

    parsifal : async function(bot) {
        parsifal.run(bot);
    },

    cataEnter: async function(bot) {
        enter.run(bot);
    }
}