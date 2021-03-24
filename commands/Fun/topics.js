const topics = require("../../assets/json/topics.json");

module.exports = {
    name: "topic",
    category: "Fun",
    cooldown: 5,
    description: "Getting bored in chat? Have no topic to chat about? Use this command to get some random topics from bot.",
    example: "topic",
    run: async(client, message, args) => {
        let topic = topics[Math.floor(Math.random() * topics.length)];
        message.channel.startTyping();
        setTimeout(() => {
            message.channel.send(topic).then(message.channel.stopTyping());
        }, 5000)
    }
}