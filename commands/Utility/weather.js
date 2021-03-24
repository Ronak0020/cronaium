// const Discord = require("discord.js");
// const request = require("node-superfetch");

// module.exports = {
//     name: "weather",
//     description: "Check weather of a city",
//     cooldown: 10,
//     category: "Utility",
//     usage: "<city name>",
//     example: "weather new york",
//     run: async (lient, message, args) => {
//         let location = args.join(" ");
//         try {
//             const { body } = await request
//                 .get('https://query.yahooapis.com/v1/public/yql')
//                 .query({
//                     q: `select * from weather.forecast where u='f' AND woeid in (select woeid from geo.places(1) where text="${location}")`,
//                     format: 'json'
//                 });
//             if (!body.query.count) return msg.say('Could not find any results.');
//             const data = body.query.results.channel;
//             const embed = new Discord.MessageEmbed()
//                 .setColor("#f0c44f")
//                 .setAuthor(data.title, 'https://i.imgur.com/IYF2Pfa.jpg', 'https://www.yahoo.com/news/weather')
//                 .setURL(data.link)
//                 .setTimestamp()
//                 .addField('❯ City', data.location.city, true)
//                 .addField('❯ Country', data.location.country, true)
//                 .addField('❯ Region', data.location.region, true)
//                 .addField('❯ Condition', data.item.condition.text, true)
//                 .addField('❯ Temperature', `${data.item.condition.temp}°F`, true)
//                 .addField('❯ Humidity', data.atmosphere.humidity, true)
//                 .addField('❯ Pressure', data.atmosphere.pressure, true)
//                 .addField('❯ Rising', data.atmosphere.rising, true)
//                 .addField('❯ Visibility', data.atmosphere.visibility, true)
//                 .addField('❯ Wind Chill', data.wind.chill, true)
//                 .addField('❯ Wind Direction', data.wind.direction, true)
//                 .addField('❯ Wind Speed', data.wind.speed, true);
//             return message.channel.send(embed);
//         } catch (err) {
//             return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
//         }
//     }
// }