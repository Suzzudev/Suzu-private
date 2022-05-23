const indb = require('../../indb')
const guildSetUp = require('../../schema/setUpGuild')

module.exports = {
    name : "reloadguild",
    description : "Reloads the guild database",
    run : async (client, interaction) => {
        const response = await indb.guild(interaction.guild.id);

        if(!response) {
            interaction.followUp("The database is not setup for this server, setting it up now,");
            return guildSetUp.setup(interaction, false);
        }
        guildSetUp.update(interaction, client);
        interaction.followUp("Database reloaded");
    }
}
