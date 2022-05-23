const client = require("../index");

module.exports = (io) => {
    category = {};
    client.commands.forEach(obj => {
        let cmdObject = {
            name: obj.name,
            permissions: obj.authorPermission,
            usage: obj.usage,
            aliases: obj.aliases,
            cooldown: obj.cooldown,
            description: obj.description,
            category: obj.category
        }
        if (Object.keys(category).find(x => x === obj.category)) {
            category[obj.category].push(cmdObject)
        } else {
            category[obj.category] = [cmdObject]
        }
    })
    
    
    io.on('connection', socket => {
        socket.emit("commands", (category));
    });
}

