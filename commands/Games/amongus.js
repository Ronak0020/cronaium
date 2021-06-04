const { stripIndents, oneLine } = require('common-tags');
const Collection = require('@discordjs/collection');
const { delay, awaitPlayers, list, reactIfAble } = require('../../utils/utils');
const words = require('../../assets/json/imposter');

module.exports = {
    name: "imposter",
    category: "Games",
    description: "Who is the imposter among us?! Find out by playing ths game based on among us game!",
    cooldown: 60,
    info: "To play the game, start it using the command then whoever wants to join, must type `join game`. The game will begin after 1 minute of using the command.",
    run: async (client, message, args) => {
        let playersCount = parseInt(args[0]) || 20;
        playersCount < 3 ? playersCount = 3 : playersCount = playersCount;
        playersCount > 20 ? playersCount = 20 : playersCount = playersCount;
        const current = client.games.get(message.channel.id);
        if (current) return message.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
        client.games.set(message.channel.id, { name: "imposter" });
        try {
            const awaitedPlayers = await awaitPlayers(message, playersCount, 3);
            if (!awaitedPlayers) {
                client.games.delete(message.channel.id);
                return message.channel.send('Game could not be started... Didn\'t get enough players.');
            }
            const word = words[Math.floor(Math.random() * words.length)];
            const wordRegex = new RegExp(`\\b${word}\\b`, 'i');
            const players = new Collection();
            const imposter = awaitedPlayers[Math.floor(Math.random() * awaitedPlayers.length)];
            await message.channel.send(oneLine`
				Welcome to Imposter! In this game, you will have to figure out who the imposter is!
				All you have to do is watch what other players say. There's a special word called a kill word.
				Only the imposter can say it, and if anyone else does, they die! To win, figure out what the kill
				word is, and try to catch the imposter saying it. As for the imposter, you know the word, try to get
				everyone to say it!
			`);
            for (const player of awaitedPlayers) {
                players.set(player, {
                    id: player,
                    user: await client.users.fetch(player),
                    killed: false,
                    imposter: imposter === player
                });
                const newPlayer = players.get(player);
                if (imposter === player) newPlayer.user.send(`You are the imposter. The kill word is ${word}.`);
                else newPlayer.user.send('You are not the imposter. Be careful what you say!');
            }
            let lastTurnTimeout = false;
            const winners = [];
            while (players.filter(player => !player.killed).size > 2) {
                const playersLeft = players.filter(player => !player.killed).size;
                await message.channel.send(`There are **${playersLeft}** players left. Talk until someone says the kill word.`);
                const filter = res => {
                    const player = players.get(res.author.id);
                    if (!player || player.killed || player.imposter) return false;
                    if (res.content && wordRegex.test(res.content)) return true;
                    return false;
                };
                const messages = await message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 600000
                });
                if (messages.size) {
                    const killedmessage = messages.first();
                    try {
                        await killedmessage.react('🔪');
                    } catch {
                        await killedmessage.reply('🔪');
                    }
                    players.get(killedmessage.author.id).killed = true;
                    await message.channel.send(stripIndents`
						${killedmessage.author} has been murdered for saying the kill word!
						Talk amongst yourselves, who is the imposter? Voting begins in 1 minute.
					`);
                } else {
                    await message.channel.send(stripIndents`
						No has said the word for 10 minutes. We're voting anyway! Who looks suspicious?
						Talk amongst yourselves, who is the imposter? Voting begins in 1 minute.
					`);
                }
                await delay(60000);
                const choices = players.filter(player => !player.killed);
                const ids = choices.map(player => player.id);
                let i = 0;
                await message.channel.send(stripIndents`
					Alright, who do you think the imposter is? You have 1 minute to vote.
					_Type the number of the player you think is the imposter._
					${choices.map(player => { i++; return `**${i}.** ${player.user.tag}`; }).join('\n')}
				`);
                const votes = new Collection();
                let voters = [];
                const voteFilter = res => {
                    const player = players.get(res.author.id);
                    if (!player || player.killed || voters.includes(res.author.id)) return false;
                    voters.push(res.author.id);
                    const int = Number.parseInt(res.content, 10);
                    if (int >= 1 && int <= players.filter(p => !p.killed).size) {
                        const currentVotes = votes.get(choices[int - 1]);
                        votes.set(ids[int - 1], {
                            votes: currentVotes ? currentVotes + 1 : 1,
                            id: ids[int - 1]
                        });
                        reactIfAble(res, res.author, "✅", '✅');
                        return true;
                    }
                    return false;
                };
                const vote = await message.channel.awaitMessages(voteFilter, {
                    max: players.filter(player => !player.killed).size,
                    time: 60000
                });
                if (!vote.size) {
                    if (lastTurnTimeout) {
                        await message.channel.send('Game ended due to inactivity.');
                        break;
                    } else {
                        await message.channel.send('Come on guys, get in the game!');
                        lastTurnTimeout = true;
                        continue;
                    }
                }
                voters = [];
                const kicked = players.get(votes.sort((a, b) => b.votes - a.votes).first().id);
                players.get(kicked.id).killed = true;
                if (kicked.id === players.find(player => player.imposter).id) {
                    await message.channel.send(`**${kicked.user.tag}** was the imposter.`);
                    winners.push(...players.filter(player => !player.killed).map(player => player.user.tag));
                    break;
                }
                const amountLeft = players.filter(player => !player.killed);
                await message.channel.send(stripIndents`
					**${kicked.user.tag}** was not the imposter.
					${amountLeft.size > 2 ? '_Next round starts in 30 seconds._' : ''}
				`);
                if (amountLeft.size > 2) {
                    await delay(30000);
                } else {
                    winners.push(players.find(player => player.imposter).user.tag);
                    break;
                }
            }
            client.games.delete(message.channel.id);
            return message.channel.send(`Congrats, ${list(winners)}! The kill word was **${word}**.`);
        } catch (err) {
            client.games.delete(message.channel.id);
            throw err;
        }
    }
}