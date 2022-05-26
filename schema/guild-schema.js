const mongo = require('mongoose');

const schema = new mongo.Schema({
    guildID : String,
    members : Array,
    firstWarning : String,
    finalWarning : String,
    firstWarningPunishment : String,
    secondWarningPunishment : String,
    muteRole : String,
    welcomeChannel : String,
    welcomeImage : String,
    welcomeImageWidth : Number,
    welcomeImageHeight : Number,
    welcomeImageMarigin : Number,
    welcomeImageAvatarX : Number,
    welcomeImageAvatarY : Number,
    welcomeImageAvatarSize : Number,
    tempBans : Array
});

module.exports = mongo.model('guild', schema);