const variables = require('./sharedVariables.json');

function run (bot) {
    bot.chat('/p leave');
    variables.inParty = false;
    if(variables.queue != []) {
        bot.chat(`/p ${variables.queue[0]}`);
        variables.queue.shift();
    }

    updateJson(variables.inParty, variables.queue);
}

function updateJson(inParty, queue) {
    
    const json = JSON.parse(fs.readFileSync('./sharedVairbles.json', 'utf8'));
    json.inParty = inParty;
    json.queue = queue;
    fs.writeFileSync('./config.json', JSON.stringify(json, null, 2));
}

module.exports = {
    run: run
}