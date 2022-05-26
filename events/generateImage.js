const { MessageAttachment } = require("discord.js")
const client = require('../index.js');
const inDb = require('../indb');
const setUp = require('../schema/guild')

const Canvas = require('canvas');


const generateImage = async (member, backgroundImg, av, dim) => {
    let tag = member.user.tag;
    let avatarUrl = member.user.avatarURL({format: 'png', dynamic: false, size: av.size});
    
    const canvas = Canvas.createCanvas(dim.width, dim.height);
    const ctx = canvas.getContext('2d');

    const background = await Canvas.loadImage(backgroundImg);
    ctx.drawImage(background, 0, 0);

    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(dim.marigin, dim.marigin, dim.width - 2 * dim.marigin, dim.height - 2 * dim.marigin);

    const avImage = await Canvas.loadImage(avatarUrl);

    ctx.save();

    ctx.beginPath();

    ctx.arc(av.x + av.size / 2, av.y + av.size / 2, av.size / 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(avImage, av.x, av.y);
    ctx.restore();

    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    ctx.font = "60px Roboto";
    ctx.fillText("Welcome", dim.width/2, dim.marigin + 70);

    ctx.font = "60px Roboto";
    ctx.fillText(tag, dim.width / 2, dim.height - dim.marigin - 125);

    ctx.font = "40px Roboto";
    ctx.fillText("to the server!", dim.width / 2, dim.height - dim.marigin - 50);

    const attachment = new MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

    return attachment;
}

module.exports = generateImage;