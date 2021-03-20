// const Discord = require("discord.js");
// let chrono = require("chrono-node");
// var moment = require('moment');
// const ms = require("ms");

// module.exports = {
//     name: "remindme",
//     category: "Utility",
//     aliases: ["remind", "reminder"],
//     usage: "<time in minutes> <message>",
//     description: "Remind yourself about anything you want.",
//     example: "remindme 2h Watch anime",
//     run: async (client, message, args) => {
//         if (!args[0]) return message.reply("Incorrect format! use `help remindme` to get info about how to use it.")
//         let messagez = args.slice(1).join(' ');
//         let min = ms(args[0]);
//         if (messagez.length < 1) return message.channel.send('Incorrect format. Get help for the command using `help remindme`');
//         return new Promise((resolve) => {
//             if (!isNaN(min)) {
//                 const time = min;
//                 //if (time > 2880 || isNaN(time)) return message.channel.send('Maximum time is 1 day (1440 minutes)');
//                 //if (time < 1) return message.channel.send('Time must be at least 1 minute.');
//                 setTimeout(() => {
//                     message.reply(`Remember: **${messagez}**!`);
//                 }, time);
//                 const minutemessage = ms(time, { long: true });
//                 return message.channel.send(`Reminding you in **${minutemessage}** for **${messagez}**`);
//             }

//             const results = chrono.parse(messagez);
//             if (results.length === 0) return message.channel.send('Error parsing date. Get help for the command using `help reminder`');

//             let endTime = moment(results[0].start.date());
//             const currentTime = new moment();
//             let duration = moment.duration(endTime.diff(currentTime));
//             let minutes = Math.round(duration.asMinutes());

//             if (minutes < 1) {
//                 if (results[0].end) {
//                     endTime = results[0].end.date();
//                     duration = moment.duration(endTime.diff(currentTime));
//                     minutes = duration.asMinutes();
//                 }
//                 if (minutes < 1) {
//                     return message.channel.send('Time must be at least 1 minute.')
//                 }
//             }
//             if (minutes > 2880) return message.channel.send('Maximum time is 2 days (2880 minutes)');

//             setTimeout(() => {
//                 message.reply(`Remember: "${messagez}"!`);
//             }, minutes * 60000);
//             const minutemessage = minutes === 1 ? 'minute' : 'minutes';
//             return message.channel.send(`Reminding you in ${minutes} ${minutemessage} for ${messagez}.`);
//         });
//     }
// }