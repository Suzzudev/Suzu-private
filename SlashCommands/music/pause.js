const player = require("../../client/player");

module.exports = {
    name: "pause",
    description: "pause the current song",
    category: "music",
    run: async (client, interaction) => {
        const queue = player.getQueue(interaction.guild.id);

        queue.setPaused(true);

        return interaction.followUp({content: "Paused the current track!"});
    },
};