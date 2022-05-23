//Check if a blacklist role exists, if not create it, then add the user to the blacklist

module.exports = {
    name : "blacklist",
    description : "Adds a user to the blacklist",
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
        if(!interaction.member.permissions.has("MANAGE_ROLES")) interaction.followUp("You cannot add users to the blacklist");
        const user = interaction.options.getUser('user');
        const guild = client.guilds.cache.get(interaction.guild.id);
        const member = guild.members.cache.get(user.id);
        const blacklistRole = guild.roles.cache.find(role => role.name === "blacklist");
        if(!blacklistRole) {
            const newRole = await guild.roles.create({
                name : "blacklist",
                color : "000000",
            });
            member.roles.add(newRole).catch((err) => console.log(err));
            interaction.followUp(`Added ${user.username} to the blacklist`);
        } else {
            member.roles.add(blacklistRole).catch((err) => console.log(err));
            interaction.followUp(`Added ${user.username} to the blacklist`);
        }
    }
}