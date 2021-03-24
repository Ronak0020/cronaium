const Discord = require('discord.js');
const hmtai = require('hmtai');

module.exports = {
    name: "animeimage",
    aliases: ["animeimg"],
    category: "Fun",
    description: "Check out some amazing Anime pics (neko)!",
    cooldown: 5,
    example: "animeimage mobile",
    usage: "[mobile | desktop]",
    info: "Use `mobile` or `desktop` option to get wallpaper for the respective screen size! And they are not only Neko wallpapers.",
    run: async (client, message, args) => {
        let image = hmtai.neko();
        if(args[0] && args[0].toLowerCase() === "mobile") image = hmtai.mobileWallpaper();
        if(args[0] && args[0].toLowerCase() === "desktop") image = hmtai.wallpaper();
        let animepicembed = new Discord.MessageEmbed()
            .setColor('#f6cc58')
            .setTitle('Anime Image')
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setImage(image);
            message.channel.send(animepicembed);
    }
}