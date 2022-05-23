const firstMessage = require('./first-message')
const client = require('./index');

module.exports = () => {
  const channelId = '967127442898690050'

  const getEmoji = (emojiName) => {
      const response = client.emojis.cache.find((emoji) => {
          emoji.name == emojiName
        })
        console.log(response);
  }

    const emojis = {
        dog2: "Skyblock nerds",
        video_game: "Game place members"
    }

const reactions = []

    var emojiText = `If you are from the skyblock doggos discord react with :dog:
if you are from game place please react with 🎮
Else, if you play skyblock react with :dog:,
otherwise react with 🎮
If you are one of my friends, I will manually set your role. \n\n`;

  
  firstMessage(client, channelId, emojiText, ['🐕', '🎮'])

  const handleReaction = (reaction, user, add) => {
    if (user.id === '723819104045105172') {
      return
    }

    const emoji = reaction._emoji.name

    var roleName;

    if(emoji == '🐕'){
        roleName = 'Skyblock nerds'
    }
    else if(emoji == '🎮'){
        roleName = 'Game place members'
    }


    const { guild } = reaction.message
    if (!roleName) {
      return
    }

    const role = guild.roles.cache.find((role) => role.name === roleName)
    const member = guild.members.cache.find((member) => member.id === user.id)

    if (add) {
      member.roles.add(role)
    } else {
      member.roles.remove(role)
    }
  }

  client.on('messageReactionAdd', (reaction, user) => {
    if (reaction.message.channel.id === channelId) {
      handleReaction(reaction, user, true)
    }
  })

  client.on('messageReactionRemove', (reaction, user) => {
    if (reaction.message.channel.id === channelId) {
      handleReaction(reaction, user, false)
    }
  })
}