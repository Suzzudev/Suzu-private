module.exports = {
    name : "add-role",
    description : "Adds a role to a user",
    category: "moderation",
    options : [
        {
            name : "user",
            description : "The players username",
            type : "USER",
            required : true,
        },
        {
            name : "role",
            description : "The role to add",
            type : "ROLE",
            required : true,
        },
    ],
    run : async (client, interaction) => {
        //checking if the user has the required permissions
        if(!interaction.member.permissions.has("MANAGE_ROLES")) interaction.followUp("You cannot add roles to other users");
        const user = interaction.options.getUser('user');
        const role = interaction.options.getRole('role');
        const guild = client.guilds.cache.get(interaction.guild.id);
        const member = guild.members.cache.get(user.id);
        member.roles.add(role).catch((err) => console.log(err));
        interaction.followUp(`Added role ${role.name} to ${user.username}`);
    }
}