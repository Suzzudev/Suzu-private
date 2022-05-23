//list the users with the blacklist role
module.exports = {
    name : "list-blacklist",
    description : "Lists the users with the blacklist role",
    category: "info",
    options : [],
    run : async (client, interaction) => {
        //checking if the user has the required permissions
        const blacklistRole = interaction.guild.roles.cache.find(role => role.name === "blacklist");
        if(!blacklistRole) return interaction.followUp("The blacklist role does not exist");
        const users = interaction.guild.members.cache.filter(member => member.roles.cache.has(blacklistRole.id));
        if(users.size === 0) return interaction.followUp("There are no users with the blacklist role");
        const userNames = users.map(user => user.user.username);
        interaction.followUp(`The following users are on the blacklist: ${userNames.join(", ")}`);
    }
}