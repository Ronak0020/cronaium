const {MessageEmbed, Message} = require("discord.js");

module.exports = {
    name: "invite",
    aliases: ["botinvite"],
    description: "Get a link for inviting this bot to your server and a link to join the support server.",
    cooldown: 5,
    category: "Info",
    run: async(client, message, args) => {
        const embed = new MessageEmbed()
        .setTitle("Invite Link")
        .setColor("#af67fc")
        .setTimestamp()
        .setFooter(client.user.username, client.user.displayAvatarURL())
        .setThumbnail(client.user.avatarURL())
        .setDescription(`Heya!
        Thanks a lot for using ${client.user.username} !
        If you like the bot, feel free to invite it to your server by following [This Link](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot) !
        
        If you find any bugs in the bot, please be sure to report them to us in our support server.
        You can join our support server by following [This Link](https://discord.gg/Ajmt7nP) !
        We appreciate your support! :D`)
        return message.channel.send(embed);
    }
}