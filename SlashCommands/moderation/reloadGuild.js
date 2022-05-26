const indb = require('../../indb')
const guild = require('../../schema/guild')

module.exports = {
    name : "reloadguild",
    description : "Reloads the guild database",
    run : async (client, interaction) => {
        const response = await indb.guild(interaction.guild.id);

        if(!response) {
            interaction.followUp("The database is not setup for this server, setting it up now,");
            return guild.setup(interaction, false);
        }
        guild.reload(interaction, client);
        interaction.followUp("Database reloaded");
    }
}
