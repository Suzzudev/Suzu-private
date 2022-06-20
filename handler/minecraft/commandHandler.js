const networth = require('./commands/networth');
const bitches = require('./commands/bitches');
const weight = require('./commands/weight');
const parsifal = require('./commands/parsifal');
module.exports = {
    networth: async function(username, bot) {
        try {
            networth.run(username, bot);
        } catch(err) {
            console.log(bot.chat('/gc There was an error!'));
        }
    },

    bitches: async function(username, bot) {
        try {
            bitches.run(username, bot);
        } catch(err) {
            console.log(bot.chat('/gc There was an error!'));
        }
    },

    weight: async function(username, bot, chat) {
        try {
            networth.run(username, bot);
        } catch(err) {
            console.log(bot.chat('/gc There was an error!'));
        }
        weight.run(username, bot, chat);
    },

    parsifal : async function(bot) {
        try {
            parsifal.run(bot);
        } catch(err) {
            console.log(bot.chat('/gc There was an error!'));
        }
    }
}