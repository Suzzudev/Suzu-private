const userSchema = require('./schema/user-schema');
const guildSchema = require('./schema/guild-schema');

module.exports = {
    interaction : async function slashInDb (interaction) {
        const id = interaction.member.id;

        const response = await userSchema.findOne  ({
            userID : id
        });

        if(response != null && response.userID == id) {
            return true;
        }
        
        return false;
    },

    message : async function msgInDb (msg) {
        id = msg.author.id;

        const response = await userSchema.findOne ({
            userID : id
        });

        if (response != null && response.userID == id) {
            return true;
        }

        return false;
    },
    guild : async function guildInDb (guildID) {

        const response = await guildSchema.findOne ({
            guildID : guildID
        });

        if (response != null && response.guildID == guildID) {
            return response;
        }

        return false;
    }

}