// const tictactoe = require('tictactoe-minimax-ai');
// const { stripIndents } = require('common-tags');
// const { verify } = require('../../utils/utils');
// const nums = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];

// module.exports = {
//     name: "tictactoe",
//     run: async(client, message, args) => {
//         if (opponent.id === message.author.id) return message.reply('You may not play against yourself.');
// 		const current = client.games.get(message.channel.id);
// 		if (current) return message.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
// 		client.games.set(message.channel.id, { name: this.name });
// 		try {
// 			if (!opponent.bot) {
// 				await message.channel.send(`${opponent}, do you accept this challenge?`);
// 				const verification = await verify(message.channel, opponent);
// 				if (!verification) {
// 					client.games.delete(message.channel.id);
// 					return message.channel.send('Looks like they declined...');
// 				}
// 			}
// 			const sides = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
// 			const taken = [];
// 			let userTurn = true;
// 			let winner = null;
// 			let lastTurnTimeout = false;
// 			while (!winner && taken.length < 9) {
// 				const user = userTurn ? message.author : opponent;
// 				const sign = userTurn ? 'X' : 'O';
// 				let choice;
// 				if (opponent.bot && !userTurn) {
// 					choice = tictactoe.bestMove(this.convertBoard(sides), { computer: 'o', opponent: 'x' });
// 				} else {
// 					await message.channel.send(stripIndents`
// 						${user}, which side do you pick? Type \`end\` to forefeit.
// 						${this.displayBoard(sides)}
// 					`);
// 					const filter = res => {
// 						if (res.author.id !== user.id) return false;
// 						const pick = res.content;
// 						if (pick.toLowerCase() === 'end') return true;
// 						return sides.includes(pick) && !taken.includes(pick);
// 					};
// 					const turn = await message.channel.awaitMessages(filter, {
// 						max: 1,
// 						time: 30000
// 					});
// 					if (!turn.size) {
// 						await message.channel.send('Sorry, time is up!');
// 						if (lastTurnTimeout) {
// 							winner = 'time';
// 							break;
// 						} else {
// 							userTurn = !userTurn;
// 							lastTurnTimeout = true;
// 							continue;
// 						}
// 					}
// 					choice = turn.first().content;
// 					if (choice.toLowerCase() === 'end') {
// 						winner = userTurn ? opponent : message.author;
// 						break;
// 					}
// 				}
// 				sides[opponent.bot && !userTurn ? choice : Number.parseInt(choice, 10) - 1] = sign;
// 				taken.push(choice);
// 				const win = this.verifyWin(sides, message.author, opponent);
// 				if (win) winner = win;
// 				if (lastTurnTimeout) lastTurnTimeout = false;
// 				userTurn = !userTurn;
// 			}
// 			client.games.delete(message.channel.id);
// 			if (winner === 'time') return message.channel.send('Game ended due to inactivity.');
// 			return message.channel.send(stripIndents`
// 				${winner === 'tie' ? 'Oh... The cat won.' : `Congrats, ${winner}!`}
// 				${this.displayBoard(sides)}
// 			`);
// 		} catch (err) {
// 			client.games.delete(message.channel.id);
// 			throw err;
// 		}

// 	verifyWin(sides, player1, player2) {
// 		const evaluated = tictactoe.boardEvaluate(this.convertBoard(sides)).status;
// 		if (evaluated === 'win') return player1;
// 		if (evaluated === 'loss') return player2;
// 		if (evaluated === 'tie') return 'tie';
// 		return false;
// 	}

// 	convertBoard(board) {
// 		const newBoard = [[], [], []];
// 		let col = 0;
// 		for (const piece of board) {
// 			if (piece === 'X') {
// 				newBoard[col].push('x');
// 			} else if (piece === 'O') {
// 				newBoard[col].push('o');
// 			} else {
// 				newBoard[col].push('_');
// 			}
// 			if (newBoard[col].length === 3) col++;
// 		}
// 		return newBoard;
// 	}

// 	displayBoard(board) {
// 		let str = '';
// 		for (let i = 0; i < board.length; i++) {
// 			if (board[i] === 'X') {
// 				str += '❌';
// 			} else if (board[i] === 'O') {
// 				str += '⭕';
// 			} else {
// 				str += nums[i];
// 			}
// 			if (i % 3 === 2) str += '\n';
// 		}
// 		return str;
// 	}
//     }
// };