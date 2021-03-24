const Discord = require("discord.js");
const Action = require("../../assets/json/actions.json");

module.exports = {
    name: "pat",
    description: "pat people or chat!",
    usage: "[@user] [@user2]...",
    example: "pat @Ronak @marley",
    cooldown: 5,
    info: "If you do not mention any user, the bot will send pat GIF saying '@your-username pats everyone in the chat'",
    category: "Actions",
    run: async(client, message, args) => {
        let members = message.mentions.members;
        let gif = Action.pat[Math.floor(Math.random() * Action.pat.length)];

        const embed = new Discord.MessageEmbed()
        .setDescription(`**${message.author} pats ${message.mentions.users.size > 0 ? members.map(m => `${m.user}`) : "everyone in the chat"} !**`)
        .setColor("#e78cf9")
        .setImage(gif)
        .setFooter(client.user.username, client.user.displayAvatarURL())
        .setTimestamp();
        message.channel.send(embed);
    }
}