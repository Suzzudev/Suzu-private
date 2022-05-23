//Send someone the github link for this project
module.exports = {
    name : "github",
    description : "Sends the github link for this project",
    category: "info",
    options : [],
    run : async (client, interaction) => {
        interaction.followUp("https://github.com/Puppy681Nuff/Suzu is the github link for this project");
    }
}
