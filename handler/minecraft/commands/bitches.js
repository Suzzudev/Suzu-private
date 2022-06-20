async function run(username, bot) {
    if((Math.floor(Math.floor(Math.random() * (100000 - 1) + 1)) == 301)){
        bot.chat(`/gc We found ${(Math.random * 1000 * 5)} ${username}, which one would you like?`)
    }
    if(username == `parsifal`) {
        bot.chat(`/gc We found ${Math.floor(((Math.random() * 1000) * 5))} ${username}, which one would you like?`)
        await setTimeout(() => {
            return bot.chat('/gc Thats a funny joke parsifal, youll never get any')
        }, 60000)
    }
    
    return bot.chat(`/gc **Cough** **Cough** None found for ${username} **Cough** **Cough**`);
}
module.exports = {
    run : run
};