module.exports = {
    name : "blacklist-remove",
    description : "Removes a user from the blacklist",
    category: "moderation",
    options : [
        {
            name : "user",
            description : "The players username",
            type : "USER",
            required : true,
        },
    ],
    run : async (client, interaction) => {
        //checking if the user has the required permissions
        if(!interaction.member.permissions.has("MANAGE_ROLES")) interaction.followUp("You cannot remove users from the blacklist");
        const user = interaction.options.getUser('user');
        const guild = client.guilds.cache.get(interaction.guild.id);
        const member = guild.members.cache.get(user.id);
        const blacklistRole = guild.roles.cache.find(role => role.name === "blacklist");
        if(!blacklistRole) return interaction.followUp("The blacklist role does not exist");
        member.roles.remove(blacklistRole).catch((err) => console.log(err));
        interaction.followUp(`Removed ${user.username} from the blacklist`);
    }
}