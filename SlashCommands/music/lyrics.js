const player = require("../../client/player");
const axios = require("axios");
const { MessageEmbed } = require("discord.js");

const getLyrics = (title) =>
    new Promise(async (ful, rej) => {
        const url = new URL("https://some-random-api.ml/lyrics");
        url.searchParams.append("title", title);

        try {
            const { data } = await axios.get(url.href);
            ful(data);
        } catch(error) {
            rej(error);
        }
    });

const subString = (length, value) => {
    const replaced = value.replace(/\n/g, "--");
    const regex = `.{1,${length}}`;
    const lines = replaced
        .match(new RegExp(regex, "g"))
        .map((line) => line.replace(/--/g, "\n"));

    return lines;
}

const createResponse = async (title) => {
    try {
        const data = await getLyrics(title);

        const embeds = substring(4096, data.lyrics).map((value, index) => {
            const isFirst = index === 0;

            return new MessageEmbed({
                title: isFirst ? `${data.title} - ${data.author}` : null,
                thumbnail: isFirst ? { url: data.thumbnail.genius } : null,
                description: value
            });
        });

        return { embeds };
    } catch(error) {
        return "Cannot find lyrics to this song. Sorry!";
    }
};

module.exports = {
    name: "lyrics",
    description: "display lyrics for the current song or specific song",
    category: "music",
    options: [
        {
            name: "title",
            description: "specific song for lyrics",
            type: "STRING",
            required: false
        }
    ],

    run: async (client, interaction) => {
        const title = interaction.options.getString("title");
        const sendLyrics = (songTitle) => {
            return createResponse(songTitle)
                .then((res) => {
                    console.log({ res });
                    interaction.followUp(res);
                })
                .catch((err) => console.log(err));
        };

        if(title) return sendLyrics(title);
        const queue = player.getQueue(interaction.guild.id);
        if(!queue?.playing)
            return interaction.followUp({
                content: "No music is currently playing"
            });

        return sendLyrics(queue.current.title);
    }
}