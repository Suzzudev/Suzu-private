# Suzu
# A bot that tries to do everything
## Preword

__** This bot is a hobby project **__
That means the bot might be updated frequently for a month, then not updated at all the next.

__** Please leave credits **__
This time I was nice enough not to make it unable to run without credits, but please leave any credits left by me

## Setup :

__** Most of the bot is preset up for you not to have to do stuff **__
To start off, open the terminal and run npm i to install dependencies

__** This part is important **__
go to the config after this, and currently it should look like this :
![](https://cdn.discordapp.com/attachments/869842587836633148/978375559908306994/Screenshot_404.png)

for the token field go to discord.com/developers, and click new application.
![](https://cdn.discordapp.com/attachments/869842587836633148/978376647466172526/Screenshot_406_LI.jpg)

In the field to make it, name it whatever you want.

after that go to the bot tab
![](https://cdn.discordapp.com/attachments/869842587836633148/978377076941930556/Screenshot_406_LI.jpg)

and then click add bot
![](https://cdn.discordapp.com/attachments/869842587836633148/978377397940420728/Screenshot_407_LI.jpg)

then click copy underneath the token
![](https://cdn.discordapp.com/attachments/869842587836633148/978378496810307674/Screenshot_408_LI.jpg)

and now, replace the "Bot-Token" with that in the "token" field (config.json)
__**The bot will not work without a token**__

in the "prefix" section, set that to anything you want, since it isn't used (yet)

for "api_key" go to hypixel.net in minecraft, and do /apinew, and copy that token and replace the "hypixel-api-key"
__**The networth command wont work without it, and crash the bot**__

in the "EMAIL" field, replace the "minecraft-account-email" with the email for your minecraft account
in the "PASSWORD" field, replace the "minecraft-account-password" with the password for your minecraft account
__**Without these you will not be able to use the minecraft passthrough**__
*I promise there isn't any grabbers, if you want to you can check*

To get your ownerID, go into your discord settings and turn on developer mode.
Right click on yourself and click copy id.
replace the "your-discord-id" with that in the "ownerID" field
__**Without this the status command wont work**__

in the activity field, you can leave it like that and change it with the bot, but it will have its starting activity as "Custom-Activity", but just set it to whatever you want

in the "status" field, it will say whether or not your bot is idle, online, or dnd (doesn't actually change anything, just the circle underneath their username)

__**If it is anything other than online, idle, or dnd the bot will crash on startup**__

for "mongolink" go to mongodb's website, and I am going to let you do this part

once your database is set up (after logging in and starting the set up process for it)
press connect and then MongoDB Compass, paste that with your username and password for the db, replacing the <username> and <password> fields

__** Either remove all mongo relate commands and code, or set this up, but if you don't do either, the bot will crash with the majority of the commands **__


## Uses for the bot

The bot has alot of features

### A customizable welcome card
Not even like you have to modify it through the code! It is modifiable through the /guild-config, and *almost everything* is configurable. It also saves the guild's welcome channel and options to the specific guild, and sends the welcome card to that channel!

### A pretty good help command
The help command is pretty big for the file (has a array of dictionaries with the specifics about the commands) and it has all of the current commands in it, just use /help (command)

### Auto punishments
The bot has a warning system. Once the person reaches the first warning punishment amount (default : 3 warnings) they will get the first punishment (default kick, since a mute role isn't set up automatically), the when they reach the second punishment amount (default 5), they will get the second punishment (default kick) __**Note : the bot will give the first punishment for every warning in between the two**__

### Anonymous vent
For you guys that dont want to send a vent message and have others know it's you, that was added into the bot. Just make sure you have a channel named "vent". (will make it configurable soon)
If you want the message logged to you (I.E : pm'd to you) you can set the log field to true
for example
/anonymousvent message:(Message) log:true

### info
Sends the developer(s) of the bot, version, prefix, github, and discord server. It also sends the amount of servers the bot is in
/info

### list-blacklist
It sends everyone with the "blacklist" role.
(will be configurable soon)

### networth
It takes in a username and then sends out the hypixel skyblock profiles networth
/networth username:PuppyNuff
__** Still in development **__

### Ban 
Bans the user
/ban user:b9ss
__** WARNING : this command may be outdated, it will be updated at some point**__

### Clear
Bulk deletes messages in the channel
/clear amount:10

### Kick
kicks the user
/kick user:b9ss
__**WARNING : this command may be outdated, it will be updated at some point**__

### mute
It mutes the user with the role named "muted"
/mute user:b9ss
__**WARNING : this command may be outdated, it will be updated at some point**__

### reloadguild
Reloads the guild database, should be used once a day for checking kicked people / new people
/reloadguild

### remove-role
Removes the role from a user
/remove role:skyblock-nerds user:b9ss
__**WARNING : this command may be outdated, it will be updated at some point**__

### warn
Adds a warning role to a user
/warn user:b9ss
__**WARNING : this command may be outdated, it will be updated at some point**__

### resetwarnings
removes all warnings from a user
/resetwarnings b9ss
(Actually entirely different from the previous lol)

### lyrics
Sends the lyrics of the current song or a song of your choice
/lyrics song: Enth E Nd

### nowPlaying
sends the currently playing song
/nowplaying

### pause
pauses the current song
/pause

### play
Plays a song
/play Krwlng

### queue
sends the songs queue (for the guild)
/queue

### resume
unpauses the song

### skip
skips the song
/skip

### volume
changes the volume the bot plays music at (in percent)
/volume 25

### status 
Changes the status of the bot
/status activity:New instructions! status:dnd

### add-role
Adds a role to a user
/add-role role:skyblock-nerds user:b9ss
__**WARNING : this command may be outdated, it will be updated at some point**__

### blacklist-remove
removes the blacklist role from a user
/blacklist-remove user:b9ss
__**WARNING : this command may be outdated, it will be updated at some point**__

### blacklist
adds the blacklist role to a user
/blacklist user:b9ss
__**WARNING : this command may be outdated, it will be updated at some point**__


## If you plan on using this for heroku

Add all of the config things into .env and change the status files to be uploaded to the database
Why do you need to do this?

Upload the code into a github repository under your name (needs sudo perms to access the files)

__**After every start on heroku all files will revert to the files uploaded to github.**__
__**Make sure you don't upload your : Bot token - gives access to use your bot for anything Minecraft email & password - gives access to your minecraft account api_key - can get your ability to access the hypixel api revoked, if someone uses it enough. Mongodb connect link - Full access to your database, and your login credentials for things that share the same credentials**__