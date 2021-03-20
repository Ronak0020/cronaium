const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "8ball",
    aliases: ["8b"],
    category: "Fun",
    description: "Want an answer for your question in yes/no? try this command!",
    usage: "<question>",
    cooldown: 5,
    example: "8ball Am I the best bot ever?",
    run: async (client, message, args) => {
        var answers = [
            'It is certain.',
            'It is decidedly so.',
            'Without a doubt.',
            'Yes definitely.',
            'You may rely on it.',
            'As I see it, yes.',
            'Most likely.',
            'Outlook good.',
            'Yes.',
            'Signs point to yes.',
            'Reply hazy try again.',
            'Ask again later.',
            'Better not tell you now.',
            'Cannot predict now.',
            'Concentrate and ask again.',
            'Don\'t count on it.',
            'My reply is no.',
            'My sources say no.',
            'Outlook not so good.',
            'Very doubtful.',
            'No way.',
            'Maybe',
            'The answer is hiding inside you',
            'No.',
            'Hang on',
            'It\'s over',
            'It\'s just the beginning',
            'Good Luck',
        ];
        let question = args.join(" ");
        if (!question) {
            return message.reply('What question should I answer on?\n\Use `help 8ball` for more information');
        }
        const embed = new MessageEmbed()
            .setTitle("8Ball Machine~")
            .setColor("#fa67cf")
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setDescription(`**Question asked -** ${question}
        **My reply -** ${answers[Math.floor(Math.random() * answers.length)]}`)
            .setTimestamp()
        message.channel.send(embed);
    }
}
