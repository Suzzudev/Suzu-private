const guildSchema = require('./guild-schema');
const userSchema = require('./user-schema');

module.exports = {
    guild : async function guildInDb (guildID, users) {
        const response = await guildSchema.findOneAndUpdate({
            guildID : guildID
        }, {
            guildID : guildID,
            members : users
        });
    },

    user : async function userInDb (userID, latestMessage, money, bank, exp, level, pings, felonTime, isFelon, timeTillReduce, items, bankSize) {
        const response = await userSchema.findOneAndUpdate({
            userID : userID
        }, {
            userID : userID,
            latestMessage : latestMessage,
            money : money,
            bank : bank,
            exp : exp,
            level : level,
            pings : pings,
            felonTime : felonTime,
            isFelon : isFelon,
            timeTillReduce : timeTillReduce,
            items : items,
            bankSize : bankSize
        });
    }
}