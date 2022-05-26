const user = require('../../schema/user');
const inDb = require('../../inDb');

module.exports = {
    name : "blacklist",
    description : "Blacklists the user",
    options : [
        {
            name : "target",
            description : "The user to add a warning to",
            type : "USER",
            required : true,
        },
    ],
    
    run : async function blacklist (client, interaction) {
        const target = interaction.options.getUser('target');
        const response = await inDb.command(target);
        if(!response) {
            user.setup(target);
            return this.run(interaction, client);
        }

        if(response.blacklisted == true) {
            return interaction.followUp("They are already blacklisted");
        }

        userData = response;       
        userData.blacklisted = true;
        user.update(userData, interaction, target);
        return interaction.followUp('User blacklisted');
    }   
}