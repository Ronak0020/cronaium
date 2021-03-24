const Discord = require("discord.js");
const request = require("node-superfetch");
const { shorten } = require("../../utils/utils");

module.exports = {
    name: "wikipedia",
    aliases: ["wiki"],
    description: "Search for information about something in wikipedia!",
    cooldown: 10,
    usage: "<search term>",
    example: "wiki time travelling",
    category: "Utility",
    run: async (client, message, args) => {
        let query = args.join(" ");
        if(!query) return message.reply("What do you want to search for? Please provide the search term as well.")
        try {
            const { body } = await request
                .get('https://en.wikipedia.org/w/api.php')
                .query({
                    action: 'query',
                    prop: 'extracts|pageimages',
                    format: 'json',
                    titles: query,
                    exintro: '',
                    explaintext: '',
                    pithumbsize: 150,
                    redirects: '',
                    formatversion: 2
                });
            const data = body.query.pages[0];
            if (data.missing) return message.channel.send('Could not find any results.');
            const embed = new Discord.MessageEmbed()
                .setColor(0xE7E7E7)
                .setTitle(data.title)
                .setAuthor('Wikipedia', 'https://i.imgur.com/Z7NJBK2.png', 'https://www.wikipedia.org/')
                .setThumbnail(data.thumbnail ? data.thumbnail.source : null)
                .setURL(`https://en.wikipedia.org/wiki/${encodeURIComponent(query).replace(/\)/g, '%29')}`)
                .setDescription(shorten(data.extract.replace(/\n/g, '\n\n')));
            return message.channel.send(embed);
        } catch (err) {
            return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
        }
    }
}