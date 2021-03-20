const yes = ['yes', 'y', 'ye', 'yeah', 'yup', 'yea', 'ya', 'hai', 'はい', 'correct'];
const no = ['no', 'n', 'nah', 'nope', 'nop', 'iie', 'いいえ', 'non', 'fuck off'];
const { MessageEmbed } = require("discord.js");

module.exports = class Util {

    static getMember(message, toFind = '') {
        toFind = toFind.toLowerCase();

        let target = message.guild.members.cache.get(toFind);

        if (!target && message.mentions.members)
            target = message.mentions.members.first();

        if (!target && toFind) {
            target = message.guild.members.cache.find(member => {
                return member.displayName.toLowerCase().includes(toFind) ||
                    member.user.tag.toLowerCase().includes(toFind)
            });
        }

        if (!target)
            target = message.member;

        return target;
    }

    static removeDuplicates(arr) {
        return [...new Set(arr)];
    }

    static getDuplicates(arra1) {
        var object = {};
        var result = [];
        arra1.forEach(function (item) {
          if(!object[item])
              object[item] = 0;
            object[item] += 1;
        })
        for (var prop in object) {
           if(object[prop] >= 1) {
               result.push(object[prop]);
           }
        }
        return result;
    }

    static replaceLevelMessage(msg, user, level) {
        return msg
            .replace(/{memberMention}/gi, "<@" + user.id + ">")
            .replace(/{memberUsername}/gi, user.username)
            .replace(/{memberTag}/gi, user.tag)
            .replace(/{level}/gi, level.level)
            .replace(/{currentXp}/gi, level.xp)
    }

    static async promptMessage(message, author, time, validReactions) {
        time *= 1000;
        for (const reaction of validReactions) await message.react(reaction);
        const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;
        return message
            .awaitReactions(filter, { max: 1, time: time })
            .then(collected => collected.first() && collected.first().emoji.name);
    }

    static formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
    }

    static async verify(channel, user, { time = 30000, extraYes = [], extraNo = [] } = {}) {
        const filter = res => {
            const value = res.content.toLowerCase();
            return (user ? res.author.id === user.id : true)
                && (yes.includes(value) || no.includes(value) || extraYes.includes(value) || extraNo.includes(value));
        };
        const verify = await channel.awaitMessages(filter, {
            max: 1,
            time
        });
        if (!verify.size) return 0;
        const choice = verify.first().content.toLowerCase();
        if (yes.includes(choice) || extraYes.includes(choice)) return true;
        if (no.includes(choice) || extraNo.includes(choice)) return false;
        return false;
    }

    static async reactIfAble(msg, user, emoji, fallbackEmoji) {
        const dm = !msg.guild;
        if (fallbackEmoji && (!dm && !msg.channel.permissionsFor(user).has('USE_EXTERNAL_EMOJIS'))) {
            emoji = fallbackEmoji;
        }
        if (dm || msg.channel.permissionsFor(user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'])) {
            try {
                await msg.react(emoji);
            } catch {
                return null;
            }
        }
        return null;
    }

    static async awaitPlayers(msg, max, min = 1) {
        if (max === 1) return [msg.author.id];
        const addS = min - 1 === 1 ? '' : 's';
        await msg.channel.send(
            `You will need at least ${min - 1} more player${addS} (at max ${max - 1}). To join, type \`join game\`.`
        );
        const joined = [];
        joined.push(msg.author.id);
        const filter = res => {
            if (res.author.bot) return false;
            if (joined.includes(res.author.id)) return false;
            if (res.content.toLowerCase() !== 'join game') return false;
            joined.push(res.author.id);
            Util.reactIfAble(res, res.author, "<:snowsgiving_tree:787167804766945281>", '✅');
            return true;
        };
        const verify = await msg.channel.awaitMessages(filter, { max: max - 1, time: 60000 });
        verify.set(msg.id, msg);
        if (verify.size < min) return false;
        return verify.map(player => player.author.id);
    }

    static shorten(text, maxLen = 2000) {
        return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text;
    }

    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static list(arr, conj = 'and') {
        const len = arr.length;
        if (len === 0) return '';
        if (len === 1) return arr[0];
        return `${arr.slice(0, -1).join(', ')}${len > 1 ? `${len > 2 ? ',' : ''} ${conj} ` : ''}${arr.slice(-1)}`;
    }

    static formatNumber(number, minimumFractionDigits = 0) {
        return Number.parseFloat(number).toLocaleString(undefined, {
            minimumFractionDigits,
            maximumFractionDigits: 2
        });
    }

    static async createEmbedPage(array, message, perpage = 5, type = "leaderbaord", {AUTHOR= `${message.guild.name} Leaderboard`, COLOR="#009696", FOOTER=`${client.user.username}`, FOOTERIMAGE=`${message.author.displayAvatarURL()}`}) {

        //const rawLeaderboard = await Levels.rawLeaderboard(message.guild.id, 50);
        //const pos = rawLeaderboard.findIndex(i => i.guildID === message.guild.id && i.userID === message.author.id) + 1;

        const embed = new MessageEmbed();
        embed.setColor(COLOR)
        embed.setDescription(`${array.slice(0, perpage).join(`${type === "inventory" ? "\n\n" : "\n"}`)}`);
        embed.setTitle(AUTHOR, message.guild.iconURL())
        embed.setFooter(FOOTER, FOOTERIMAGE)
        embed.setTimestamp()

        let pageno = 1;
        const msg = await message.channel.send({
            embed: embed
        });

        if (array.length > perpage) {
            const reaction1 = await msg.react('◀');
            const reaction2 = await msg.react('▶');

            let first = 0;
            let second = perpage;

            const collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id, {
                time: 120000
            });
            collector.on('collect', (r) => {
                const reactionadd = array.slice(first + perpage, second + perpage).length;
                const reactionremove = array.slice(first - perpage, second - perpage).length;

                if (r.emoji.name === '▶' && reactionadd !== 0) {
                    pageno = pageno + 1
                    r.users.remove(message.author.id);

                    first += perpage;
                    second += perpage;
                    embed.setDescription(`${array.slice(first, second).join(`${type === "inventory" ? "\n\n" : "\n"}`)}`);
                    embed.setFooter(FOOTER, FOOTERIMAGE)
                    msg.edit({
                        embed: embed
                    });
                }
                else if (r.emoji.name === '◀' && reactionremove !== 0) {
                    r.users.remove(message.author.id);
                    pageno = pageno - 1
                    first -= perpage;
                    second -= perpage;
                    embed.setDescription(`${array.slice(first, second).join(`${type === "inventory" ? "\n\n" : "\n"}`)}`);
                    embed.setFooter(FOOTER, FOOTERIMAGE)
                    msg.edit({
                        embed: embed
                    })
                }
            });
            collector.on('end', () => {
                msg.reactions.removeAll();
            })
        }
    }

    static makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
     }
}