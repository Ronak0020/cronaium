const Discord = require("discord.js");
const Action = require("../../assets/json/actions.json");

module.exports = {
    name: "hug",
    description: "Hug people or chat!",
    usage: "[@user] [@user2]...",
    example: "hug @Rem @marley",
    cooldown: 5,
    info: "If you do not mention any user, the bot will send hug GIF saying '@your-username hugs everyone in the chat'",
    category: "Actions",
    run: async(client, message, args) => {
        let members = message.mentions.members;
        if(!message.mentions.members) members = "everyone in the chat";
        let gif = Action.hug[Math.floor(Math.random() * Action.hug.length)];

        const embed = new Discord.MessageEmbed()
        .setDescription(`**${message.author} hugs ${message.mentions.users.size > 0 ? members.map(m => `${m.user}`) : "everyone in the chat"} !**`)
        .setColor("#e78cf9")
        .setImage(gif)
        .setFooter(client.user.username, client.user.displayAvatarURL())
        .setTimestamp();
        message.channel.send(embed);
    }
}