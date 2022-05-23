const guildSchema = require('./guild-schema');
const userSchema = require('./user-schema');

module.exports = { 
    guild : async (interaction, firstWarning, finalWarning, firstWarningPunishment, secondWarningPunishment, muteRole, welcomeChannel, welcomeImage, welcomeImageWidth, welcomeImageHeight, welcomeImageMarigin, welcomeImageAvatarX, welcomeImageAvatarY, welcomeImageAvatarSize) => {
        guildSchema.findOneAndUpdate(
            {
                guildID : interaction.guild.id
            }, {
                guildID : interaction.guild.id,
                firstWarning : firstWarning,
                finalWarning : finalWarning,
                firstWarningPunishment : firstWarningPunishment,
                secondWarningPunishment : secondWarningPunishment,
                muteRole : muteRole,
                welcomeChannel : welcomeChannel,
                welcomeImage : welcomeImage,
                welcomeImageWidth : welcomeImageWidth,
                welcomeImageHeight : welcomeImageHeight,
                welcomeImageMarigin : welcomeImageMarigin,
                welcomeImageAvatarX : welcomeImageAvatarX,
                welcomeImageAvatarY : welcomeImageAvatarY,
                welcomeImageAvatarSize : welcomeImageAvatarSize
            })
            .then(() => {
                interaction.followUp("Updated guild settings");
            }
        )
    },
}