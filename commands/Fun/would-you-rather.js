const wyr = require("../../assets/json/would-you-rather.json");

module.exports = {
    name: "wouldyourather",
    aliases: ["wyr"],
    cooldown: 5,
    description: "get some would you rather questions.",
    category: "Fun",
    run: async(client, message, args) => {
        let topic = wyr[Math.floor(Math.random() * wyr.length)];
        message.channel.startTyping();
        setTimeout(() => {
            message.channel.send(topic).then(message.channel.stopTyping());
        }, 5000)
    }
}