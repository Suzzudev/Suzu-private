module.exports = {
    name : "clear",
    description : "Clears the chat",
    category: "moderation",
    options : [
        {
            name : "amount",
            description : "The amount of messages to delete",
            type : "INTEGER",
            required : true,
        },
    ],
    run : async (client, interaction) => {
        //checking if the user has the required permissions
        if(!interaction.member.permissions.has("MANAGE_MESSAGES")) interaction.followUp("You cannot clear the chat");
        const amount = interaction.options.getInteger('amount');
        const messages = await interaction.channel.messages.fetch({ limit : amount + 1 });
        await interaction.channel.bulkDelete(messages);
    }
}