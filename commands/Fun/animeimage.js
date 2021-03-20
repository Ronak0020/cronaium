// const Discord = require('discord.js');
// const snekfetch = require('snekfetch');

// module.exports = {
//     name: "animeimage",
//     aliases: ["animeimg"],
//     category: "Fun",
//     description: "Check out some amazing Anime pics!",
//     cooldown: 5,
//     example: "animeimage",
//     run: async (client, message, args) => {
//         let res = await snekfetch.get('http://api.cutegirls.moe/json');
//         if (res.body.status !== 200) {
//             return message.channel.send('An error occurred while processing this command. Please try again!');
//         }
//         let animepicembed = new Discord.RichEmbed()
//             .setColor('#f266f9')
//             .setTitle('Anime Image')
//             .setImage(res.body.data.image); message.channel.send(animepicembed);
//     }
// }