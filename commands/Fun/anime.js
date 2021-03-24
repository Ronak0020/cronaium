const Discord = require('discord.js');
var aq = require('animequote');
const malScraper = require('mal-scraper')

module.exports = {
    name: 'anime',
    category: "Fun",
    aliases: ["animesearch", "sanime"],
    description: "Search for your favourite anime and get info about them!",
    info: "If you will not provide a search term, the bot will look for a random anime and will show details for it. Good for those who are looking for an anime to watch!",
    usage: "[anime name]",
    example: "anime attack on titan",
    run: async(client, message, args) => {
        let search = args.join(" ");
        if (!search) {
            malScraper.getInfoFromName(aq().quoteanime).then(result => {
                let anime = result;
                let embed = new Discord.MessageEmbed()
                    .setColor('#A65EA5')
                    .setURL(anime.url)
                    .setTitle(`${anime.englishTitle ? anime.englishTitle : anime.title} | ${anime.type}`, anime.picture)
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                    .setTimestamp()
                    .setDescription(anime.synopsis.replace(/<[^>]*>/g, '').split('\n')[0])
                    .addField('❯\u2000\Information', `•\u2000\**Japanese Name:** ${anime.japaneseTitle}\n\•\u2000\**Age Rating:** ${anime.rating}\n\•\u2000\**Genres:** ${anime.genres.join(", ")}`, true)
                    .addField('❯\u2000\Stats', `•\u2000\**Average Rating:** ${anime.score}\n\•\u2000\**Rating Rank:** ${anime.ranked}\n\•\u2000\**Popularity Rank:** ${anime.popularity}`, true)
                    .addField('❯\u2000\Status', `•\u2000\**Episodes:** ${anime.episodes ? anime.episodes : 'N/A'}\n\•\u2000\**Premiered:** ${anime.premiered}\n\•\u2000\**Aired:** ${anime.aired}`, true)
                    .setImage(anime.picture);
                return message.channel.send(`Try watching **${anime.englishTitle}**!`, { embed: embed });
            })
    
        } else {
            malScraper.getInfoFromName(search).then(result => {
                let anime = result;
                let embed = new Discord.MessageEmbed()
                    .setColor('#A65EA5')
                    .setURL(anime.url)
                    .setTitle(`${anime.englishTitle ? anime.englishTitle : anime.title} | ${anime.type}`, anime.picture)
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                    .setTimestamp()
                    .setDescription(anime.synopsis.replace(/<[^>]*>/g, '').split('\n')[0])
                    .addField('❯\u2000\Information', `•\u2000\**Japanese Name:** ${anime.japaneseTitle}\n\•\u2000\**Age Rating:** ${anime.rating}\n\•\u2000\**Genres:** ${anime.genres.join(", ")}`, true)
                    .addField('❯\u2000\Stats', `•\u2000\**Average Rating:** ${anime.score}\n\•\u2000\**Rating Rank:** ${anime.ranked}\n\•\u2000\**Popularity Rank:** ${anime.popularity}`, true)
                    .addField('❯\u2000\Status', `•\u2000\**Episodes:** ${anime.episodes ? anime.episodes : 'N/A'}\n\•\u2000\**Premiered:** ${anime.premiered}\n\•\u2000\**Aired:** ${anime.aired}`, true)
                    .setImage(anime.picture);
                return message.channel.send({ embed });
            }).catch(err => {
                console.log(err)
                return message.channel.send(`No results found for **${search}**!`);
            });
        }
    }
}

// {
//     title: 'Umineko no Naku Koro ni',
//     synopsis: "Considered as the third installment in the highly popular When They Cry series by 07th Expansion, Umineko no Naku Koro ni takes place on the island of Rokkenjima, owned by the immensely wealthy Ushiromiya family. As customary per year, the entire family is gathering on the island for a conference that discusses the current financial situations of each respective person. Because of the family head's poor health, this year involves the topic of the head of the family's inheritance and how it will be distributed.\n" +    
//       '\n' +
//       "However, the family is unaware that the distribution of his wealth is the least of Ushiromiya Kinzou's (family head) concerns for this year's family conference. After being told that his end was approaching by his longtime friend and physician, Kinzou is desperate to meet his life's true love one last time: the Golden Witch, Beatrice. Having immersed 
//   himself in black magic for many of the later years in his life, Kinzou instigates a ceremony to revive his beloved upon his family's arrival on Rokkenjima. Soon after, a violent typhoon traps the family on the island and a string of mysterious murders commence, forcing the eighteen people on the island to fight for their lives in a deadly struggle between 
//   fantasy and reality.\n" +
//       '\n' +
//       '[Written by MAL Rewrite]',
//     picture: 'https://cdn.myanimelist.net/images/anime/10/17709.jpg',
//     characters: [
//       {
//         link: 'https://myanimelist.net/character/10285/Beatrice',
//         picture: 'https://cdn.myanimelist.net/images/characters/16/318556.jpg',
//         name: 'Beatrice',
//         role: 'Main',
//         seiyuu: [Object]
//       },
//       {
//         link: 'https://myanimelist.net/character/14040/Battler_Ushiromiya',
//         picture: 'https://cdn.myanimelist.net/images/characters/4/83717.jpg',
//         name: 'Ushiromiya, Battler',
//         role: 'Main',
//         seiyuu: [Object]
//       },
//       {
//         link: 'https://myanimelist.net/character/19407/Ange_Ushiromiya',
//         picture: 'https://cdn.myanimelist.net/images/characters/11/307044.jpg',
//         name: 'Ushiromiya, Ange',
//         role: 'Main',
//         seiyuu: [Object]
//       },
//       {
//         link: 'https://myanimelist.net/character/8555/Maria_Ushiromiya',
//         picture: 'https://cdn.myanimelist.net/images/characters/6/93573.jpg',
//         name: 'Ushiromiya, Maria',
//         role: 'Main',
//         seiyuu: [Object]
//       },
//       {
//         link: 'https://myanimelist.net/character/14045/Kanon',
//         picture: 'https://cdn.myanimelist.net/images/characters/12/61435.jpg',
//         name: 'Kanon',
//         role: 'Main',
//         seiyuu: [Object]
//       },
//       {
//         link: 'https://myanimelist.net/character/15435/Shannon',
//         picture: 'https://cdn.myanimelist.net/images/characters/16/321630.jpg',
//         name: 'Shannon',
//         role: 'Main',
//         seiyuu: [Object]
//       },
//       {
//         link: 'https://myanimelist.net/character/14044/Jessica_Ushiromiya',
//         picture: 'https://cdn.myanimelist.net/images/characters/13/99316.jpg',
//         name: 'Ushiromiya, Jessica',
//         role: 'Main',
//         seiyuu: [Object]
//       },
//       {
//         link: 'https://myanimelist.net/character/14042/George_Ushiromiya',
//         picture: 'https://cdn.myanimelist.net/images/characters/3/315525.jpg',
//         name: 'Ushiromiya, George',
//         role: 'Main',
//         seiyuu: [Object]
//       },
//       {
//         link: 'https://myanimelist.net/character/11840/Frederica_Bernkastel',
//         picture: 'https://cdn.myanimelist.net/images/characters/9/335094.jpg',
//         name: 'Bernkastel, Frederica',
//         role: 'Supporting',
//         seiyuu: [Object]
//       },
//       {
//         link: 'https://myanimelist.net/character/10196/Lambdadelta',
//         picture: 'https://cdn.myanimelist.net/images/characters/4/91253.jpg',
//         name: 'Lambdadelta',
//         role: 'Supporting',
//         seiyuu: [Object]
//       }
//     ],
//     staff: [
//       {
//         link: 'https://myanimelist.net/people/6831/Chiaki_Kon',
//         picture: 'https://cdn.myanimelist.net/images/voiceactors/1/43174.jpg',
//         name: 'Kon, Chiaki',
//         role: 'Director, Storyboard'
//       },
//       {
//         link: 'https://myanimelist.net/people/936/Hozumi_Gouda',
//         picture: 'https://cdn.myanimelist.net/images/voiceactors/1/48871.jpg',
//         name: 'Gouda, Hozumi',
//         role: 'Sound Director'
//       },
//       {
//         link: 'https://myanimelist.net/people/19333/Shunji_Yoshida',
//         picture: 'https://cdn.myanimelist.net/images/questionmark_23.jpg',
//         name: 'Yoshida, Shunji',
//         role: 'Episode Director'
//       },
//       {
//         link: 'https://myanimelist.net/people/42078/Hiroyuki_Tsuchiya',
//         picture: 'https://cdn.myanimelist.net/images/questionmark_23.jpg',
//         name: 'Tsuchiya, Hiroyuki',
//         role: 'Episode Director'
//       }
//     ],
//     trailer: 'https://www.youtube.com/embed/dcPNaY3EIUc?enablejsapi=1&wmode=opaque&autoplay=1',
//     englishTitle: 'Umineko: When They Cry',
//     japaneseTitle: 'うみねこのなく頃に',
//     synonyms: [
//       'When They Cry 3',
//       'When the Seagulls Cry',
//       'When They Cry: Seagulls'
//     ],
//     type: 'TV',
//     episodes: '26',
//     aired: 'Jul 2, 2009 to Dec 24, 2009',
//     premiered: 'Summer 2009',
//     broadcast: 'Unknown',
//     producers: [
//       'Geneon Universal Entertainment',
//       'Frontier Works',
//       'Sotsu',
//       'Movic'
//     ],
//     studios: [ 'Studio Deen' ],
//     source: 'Visual novel',
//     duration: '23 min. per ep.',
//     rating: 'R - 17+ (violence & profanity)',
//     status: 'Finished Airing',
//     genres: [ 'Mystery', 'Horror', 'Psychological', 'Supernatural' ],
//     score: '7.12',
//     scoreStats: 'scored by 77,883 users',
//     ranked: '#3143',
//     popularity: '#821',
//     members: '186,440',
//     favorites: '2,077',
//     id: 4896,
//     url: 'https://myanimelist.net/anime/4896/Umineko_no_Naku_Koro_ni'
//   }