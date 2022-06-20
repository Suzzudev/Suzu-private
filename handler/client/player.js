const { Player } = require("discord-player");

const client = require("../../index.js");

const player = new Player(client, {
    ytdlOptions: {
        filter: "audioonly",
        highWaterMark: 1 << 25,
        quality: "highestaudio",
    },
});

module.exports = player;