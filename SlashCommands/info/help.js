const Discord = require('discord.js');

module.exports = {
    name : "help",
    description : "Sends help on commands",
    options : [
        {
            name:  "command",
            description: "The command to show how it works?",
            type: "STRING",
            required: true,
        }
    ],
    run : async (client, interaction) => {

        const help = [
            {
                name : "guild-config",
                description : "Changed the guilds configuration",
                options : "first warnings : the amount of warnings before the first punishment\nfinal warning : The amount of warnings before the final punishment.\nfirstwarningpunishment : The first punishment they will get\nsecondwarningpunishment : the final punishment for reaching the warning count\nmute-role : The role to mute users\nwelcome-channel : The channel to send the welcome message to",
                examples : "/guild-config firstwarning 3\n/guild-config finalwarning 5\n/guild-config firstwarningpunishment kick\n/guild-config secondwarningpunishment ban\n/guild-config mute-role @Muted",
                aliases : "aliases not set up yet",
                permissions: "admin"
            },
            {
                name : "anonymousvent",
                description : "Sends the vent message anonymously to the vent channel",
                options : "message : The message to send\nlog : Whether or not to log the message (pm to you)",
                examples : "/anonymousvent message\n/anonymousvent message log:true",
                aliases : "aliases not set up yet"
            },
            {
                name : 'github',
                description : "Sends someone the github link for this project",
                options : "none",
                examples : "/github",
                aliases : "aliases not set up yet"
            },
            {
                name : "help",
                description : "Shows the help menu",
                options : "command : The command to show how it works",
                examples : "/help help\n/help guild-config",
                aliases : "aliases not set up yet"
            },
            {
                name : "list-blacklist",
                description : "Lists the blacklisted users",
                options : "none",
                examples : "/list-blacklist",
                aliases : "aliases not set up yet"
            },
            {
                name : "networth",
                description : "Sends the users networth",
                options : "user : The players username",
                examples : "/networth (minecraft username)",
                aliases : "aliases not set up yet"
            },
            {
                name : "ban",
                description : "Bans a user",
                options : "user : The user to ban\nlogchannel : The channel to log the ban in\nreason : The reason for the ban",
                examples : "/ban @user\n/ban @user logchannel\n/ban @user logChannel tooManyWarnings",
                aliases : "aliases not set up yet",
                permissions : "BAN_MEMBERS"
            },
            {
                name : "clear",
                description : "Clears a certain amount of messages",
                options : "amount : The amount of messages to clear",
                examples : "/clear 10",
                permissions : "MANAGE_MESSAGES",
                aliases : "aliases not set up yet"
            },
            {
                name : "kick",
                description : "Kicks a user",
                options : "user : The user to kick\nlogchannel : The channel to log the kick in\nreason : The reason for the kick",
                examples : "/kick @user\n/kick @user logchannel\n/kick @user logChannel tooManyWarnings",
                aliases : "aliases not set up yet",
                permissions : "KICK_MEMBERS"
            },
            {
                name : "mute",
                description : "Mutes a user",
                options : "user : The user to mute\nlogchannel : The channel to log the mute in\nreason : The reason for the mute",
                examples : "/mute @user\n/mute @user logchannel\n/mute @user logChannel tooManyWarnings",
                aliases : "aliases not set up yet",
                permissions : "MANAGE_ROLES"
            },
            {
                name : "reloadGuild",
                description : "Reloads the guild database",
                options : "none",
                examples : "/reloadGuild",
                aliases : "aliases not set up yet"
            },
            {
                name : "remove-role",
                description : "Removes a role from a user",
                options : "user : The user to remove the role from\nrole : The role to remove",
                examples : "/remove-role @user @role",
                aliases : "aliases not set up yet",
                permissions : "MANAGE_ROLES"
            },
            {
                name : "warn",
                description : "Warns a user",
                options : "user : The user to warn",
                examples : "/warn @user",
                aliases : "aliases not set up yet"
            },
            {
                name : "lyrics",
                description : "Sends the lyrics of a song",
                options : "song : The song to send the lyrics for",
                examples : "/lyrics\n/lyrics song",
                aliases : "aliases not set up yet"
            },
            {
                name : "play",
                description : "Plays a song",
                options : "song : The song to play",
                examples : "/play\n/play song",
                aliases : "aliases not set up yet"
            },
            {
                name : "pause",
                description : "Pauses the current song",
                options : "none",
                examples : "/pause",
                aliases : "aliases not set up yet"
            },
            {
                name : "resume",
                description : "Resumes the current song",
                options : "none",
                examples : "/resume",
                aliases : "aliases not set up yet"
            },
            {
                name : "skip",
                description : "skips the current song",
                options : "none",
                examples : "/skip",
                aliases : "aliases not set up yet"
            },
            {
                name : "volume",
                description : "Changes the volume of the current song",
                options : "volume : The volume to change the song to",
                examples : "/volume\n/volume volume",
                aliases : "aliases not set up yet"
            },
            {
                name: "status",
                description: "Changes the status of the bot",
                options: "status : The status to change the bot to\ngame : The game to change the bot to",
                examples: "/status\n/status status\n/status game",
                aliases: "aliases not set up yet",
                permissions: "Owner only"
            },
            {
                name : "add-role",
                description : "Adds a role to a user",
                options : "user : The user to add the role to\nrole : The role to add",
                examples : "/add-role @user @role",
                aliases : "aliases not set up yet",
                permissions : "MANAGE_ROLES"
            },
            {
                name : "blacklist-remove",
                description : "Removes a user from the blacklist",
                options : "user : The user to remove from the blacklist",
                examples : "/blacklist-remove @user",
                aliases : "aliases not set up yet"
            },
            {
                name : "blacklist",
                description : "Adds a user to the blacklist",
                options : "user : The user to add to the blacklist",
                examples : "/blacklist @user",
                aliases : "aliases not set up yet"
            },
            {
                name : "info",
                description : "Gets information about the bot",
                options : "none",
                examples : "/info",
                aliases : "aliases not set up yet"
            }
        ];  
        var command = interaction.options.getString('command');
        command = command.toLowerCase();

        for(i = 0; i < help.length; i++) {
            if(help[i].name == command) {

                if(help[i].permmisions == undefined) {
                    help[i].permissions = "None or not defined";
                }
                    
                const embed = new Discord.MessageEmbed()
                    .setTitle(help[i].name)
                    .addField("Description", help[i].description)
                    .addField("Options", help[i].options)
                    .addField("Examples", help[i].examples)
                    .addField("Aliases", help[i].aliases)
                    .addField("Permissions", help[i].permissions)
                    .setColor(0x00AE86);
                return interaction.followUp({embeds : [embed]});
            }
        }
        return interaction.followUp("that is not a valid command");
    }
}