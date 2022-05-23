const guildSchema = require('../../schema/guild-schema');
const configUpdate = require('../../schema/configUpdate');
const inDb = require('../../indb.js');
const { Permissions, WelcomeChannel } = require('discord.js');

module.exports = {
    name : "guild-config",
    description : "Configure the guild",
    options : [
        {
            name : "firstwarning",
            description : "The warning amount that gives the first punishment",
            type : "NUMBER",
            required : false,
        },
        {
            name : "finalwarning",
            description : "The warning amount that gives the final punishment",
            type : "NUMBER",
            required : false,
        },
        {
            name : "firstwarningpunishment",
            description : "The punishment to take when a user has reached the first warning amount",
            type : "STRING",
            required : false,
        },
        {
            name : "secondwarningpunishment",
            description : "The punishment to take when a user has reached the second warning amount",
            type : "STRING",
            required : false,
        },
        {
            name : "mute-role",
            description : "The role to mute users with",
            type : "ROLE",
            required : false,
        }, {
            name : "welcome-channel",
            description : "The channel to send the welcome message to",
            type : "CHANNEL",
            required : false,
        },
        {
            name: "welcome-image",
            description: "The url to the image to use for the welcome message",
            type: "STRING",
            required: false,
        },
        {
            name: "welcome-image-width",
            description: "The width of the image to use for the welcome message",
            type: "NUMBER",
            required: false,
        },
        {
            name: "welcome-image-height",
            description: "The height of the image to use for the welcome message",
            type: "NUMBER",
            required: false,
        },
        {
            name: "welcome-image-marigin",
            description: "The marigin of the image to use for the welcome message",
            type: "NUMBER",
            required: false,
        },
        {
            name: "welcome-image-avatar-x",
            description: "The x position of the avatar in the image to use for the welcome message",
            type: "NUMBER",
            required: false,
        },
        {
            name: "welcome-image-avatar-y",
            description: "The y position of the avatar in the image to use for the welcome message",
            type: "NUMBER",
            required: false,
        },
        {
            name: "welcome-image-avatar-size",
            description: "The size of the avatar in the image to use for the welcome message",
            type: "NUMBER",
            required: false,
        },
    ],
    
    run : async (client, interaction) => {
        var firstWarning = interaction.options.getNumber('firstWarning');
        var finalWarning = interaction.options.getNumber('finalWarning');
        var firstWarningPunishment = interaction.options.getString('firstWarningPunishment');
        var secondWarningPunishment = interaction.options.getString('secondWarningPunishment');
        var welcomeChannel = interaction.options.getChannel('welcome-channel');
        var welcomeImage = interaction.options.getString('welcome-image');
        var welcomeImageWidth = interaction.options.getNumber('welcome-image-width');
        var welcomeImageHeight = interaction.options.getNumber('welcome-image-height');
        var welcomeImageMarigin = interaction.options.getNumber('welcome-image-marigin');
        var welcomeImageAvatarX = interaction.options.getNumber('welcome-image-avatar-x');
        var welcomeImageAvatarY = interaction.options.getNumber('welcome-image-avatar-y');
        var welcomeImageAvatarSize = interaction.options.getNumber('welcome-image-avatar-size');
        var muteRole = interaction.options.getRole('mute-role');
        const guild = interaction.guild;
        const guildID = guild.id;

        if(welcomeImage || welcomeImageAvatarSize || welcomeImageAvatarX || welcomeImageAvatarY || welcomeImageHeight || welcomeImageMarigin || welcomeImageWidth) {
            interaction.channel.send("The welcome image settings will need a little fiddling with to make sure they are right");
        }

        if(welcomeImageAvatarSize > 512) {
            interaction.channel.send("The avatar size cannot be greater than 512, since I havent tested above that size, and some sizes crash the bot");
        }

        if(!firstWarning && !finalWarning && !firstWarningPunishment && !secondWarningPunishment && !muteRole && !welcomeChannel && !welcomeImage && !welcomeImageWidth && !welcomeImageHeight && !welcomeImageMarigin && !welcomeImageAvatarX && !welcomeImageAvatarY && !welcomeImageAvatarSize) {
            interaction.followUp("You need to specify at least one thing to change");
            return;
        }

        if( firstWarningPunishment != "kick" && firstWarningPunishment != "ban" && firstWarningPunishment != "mute" && firstWarningPunishment != null) {
            interaction.followUp("The punishment must be either 'kick', 'ban', or 'mute'");
            return;
        }

        if( secondWarningPunishment != "kick" && secondWarningPunishment != "ban" && secondWarningPunishment != "mute" && secondWarningPunishment != null) {
            interaction.followUp("The punishment must be either 'kick', 'ban', or 'mute'");
            return;
        }

        if(!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            interaction.followUp("You do not have permission to configure the guild");
            return;
        }
        const response = await inDb.guild(guildID);

        if(!response) {
            interaction.followUp("The database is not setup for this server, setting it up now, and no members have any warnings");
            return guildSetup.setup(interaction, false);
        }

        if(!firstWarning) {
            if(response.firstWarning)
            {
                firstWarning = response.firstWarning;
            } else {
                firstWarning = 3;
            }
        } 

        if(!finalWarning) {
            if(response.finalWarning)
            {
                finalWarning = response.finalWarning;
            } else {
                finalWarning = 5;
            }
        }

        if(!firstWarningPunishment) {
            if(response.firstWarningPunishment)
            {
                firstWarningPunishment = response.firstWarningPunishment;
            } else {
                if(response.muteRole) {
                    firstWarningPunishment = "mute";
                } else {
                    firstWarningPunishment = "kick";
                    interaction.channel.send("first warning will be set to kick, because there is no mute role set up");
                }
            }
        }

        if(!secondWarningPunishment) {
            if(response.secondWarningPunishment)
            {
                secondWarningPunishment = response.secondWarningPunishment;
            } else {
                secondWarningPunishment = "kick";
            }
        }

        if(!muteRole) {
            if(!response.muteRole) {
                interaction.channel.send("No mute role was set, mute option wont work until you set one, if it is mute, auto setting to kick");
                warningPunishment = "kick";
            }
            muteRole = response.muteRole;
        } else {
            muteRole = muteRole.id;
        }

        if(!welcomeChannel) {
            if(!response.welcomeChannel) {
                interaction.channel.send("No welcome channel was set, welcome message wont work until you set one");
            }
            welcomeChannel = response.welcomeChannel;
        } else {
            welcomeChannel = welcomeChannel.id;
        }

        if(!welcomeImage) {
            if(!response.welcomeImage) {
                interaction.channel.send("No welcome image was set, welcome message wont work until you set one");
            }
            welcomeImage = response.welcomeImage;
        }

        if(!welcomeImageWidth) {
            if(!response.welcomeImageWidth) {
                interaction.channel.send("No welcome image width was set, welcome message wont work until you set one");
            }
            welcomeImageWidth = response.welcomeImageWidth;
        }

        if(!welcomeImageHeight) {
            if(!response.welcomeImageHeight) {
                interaction.channel.send("No welcome image height was set, welcome message wont work until you set one");
            }
            welcomeImageHeight = response.welcomeImageHeight;
        }

        if(!welcomeImageMarigin) {
            if(!response.welcomeImageMarigin) {
                interaction.channel.send("No welcome image marigin was set, welcome message wont work until you set one");
            }
            welcomeImageMarigin = response.welcomeImageMarigin;
        }

        if(!welcomeImageAvatarX) {
            if(!response.welcomeImageAvatarX) {
                interaction.channel.send("No welcome image avatar x position was set, welcome message wont work until you set one");
            }
            welcomeImageAvatarX = response.welcomeImageAvatarX;
        }

        if(!welcomeImageAvatarY) {
            if(!response.welcomeImageAvatarY) {
                interaction.channel.send("No welcome image avatar y position was set, welcome message wont work until you set one");
            }
            welcomeImageAvatarY = response.welcomeImageAvatarY;
        }

        if(!welcomeImageAvatarSize) {
            if(!response.welcomeImageAvatarSize) {
                interaction.channel.send("No welcome image avatar size was set, welcome message wont work until you set one");
            }
            welcomeImageAvatarSize = response.welcomeImageAvatarSize;
        }

        
        if(!welcomeImage.includes("https://cdn.discordapp.com/")) {
            interaction.reply(`${welcomeImage} is not a valid image url, please upload the image to a discord server / dm and use that, since other ones crash the bot`);
        }

        
        return configUpdate.guild(interaction, firstWarning, finalWarning, firstWarningPunishment, secondWarningPunishment, muteRole, welcomeChannel, welcomeImage, welcomeImageWidth, welcomeImageHeight, welcomeImageMarigin, welcomeImageAvatarX, welcomeImageAvatarY, welcomeImageAvatarSize);
    }   
}