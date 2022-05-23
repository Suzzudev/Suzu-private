const player = require("../../client/player");

module.exports = {
    name: "skip",
    description: "skips the current song",
    category: "music",
    run: async (client, interaction, args) => {
        const queue = player.getQueue(interaction.guild.id);
        if(!queue?.playing) 
            return interaction.followUp({
                content: "No music is currently being played",
            });
        
        await queue.skip();
        interaction.followUp({ content: "Skipped the current track!" });
    }
}