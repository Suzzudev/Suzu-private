const inDb = require('../indb');
const userSchema = require('./user-schema');

module.exports = {
    setup : async function setupUser(user, interaction) {
        const userData = {
            userID : user.id,
            money : 0,
            bank : 0,
            exp : 0,
            level : 0,
            felonTime : 0,
            isFelon : "false",
            timeTillReduce : 0,
            items : [],
            bankSize : 0,
            blacklisted : false
        }

        const userModel = userSchema(userData).save();
    },


    update : async function updateUser(userData, interaction, user) {
        const response = inDb.interaction(interaction);
        if(!response) {
            this.setup(user, interaction);
            return this.update(userData, interaction, user);
        }

        console.log(userData)

        const final = await userSchema.findOneAndUpdate({
            userID : user.id
        }, {
            userID : user.id,
            money : userData.money,
            bank : userData.bank,
            exp : userData.exp,
            level : userData.level,
            felonTime : userData.felonTime,
            isFelon : userData.isFelon,
            timeTillReduce : userData.timeTillReduce,
            items : userData.items,
            bankSize : userData.bankSize,
            blacklisted : userData.blacklisted
        })
    }
}