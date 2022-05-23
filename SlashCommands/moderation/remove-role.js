//Remove a role from a user
module.exports = {
    name : "remove-role",
    description : "Removes a role from a user",
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
            description : "The role to remove",
            type : "ROLE",
            required : true,
        },
    ],
    run : async (client, interaction) => {
        //checking if the user has the required permissions
        if(!interaction.member.permissions.has("MANAGE_ROLES")) interaction.followUp("You cannot remove roles from other users");
        const user = interaction.options.getUser('user');
        const role = interaction.options.getRole('role');
        const guild = client.guilds.cache.get(interaction.guild.id);
        const member = guild.members.cache.get(user.id);
        member.roles.remove(role).catch((err) => console.log(err));
        interaction.followUp(`Removed role ${role.name} from ${user.username}`);
    }
}