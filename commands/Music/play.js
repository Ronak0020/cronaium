// module.exports = {
//     name: "play",
//     run: async (client, message, args) => {
//         if (!args) return;
//         const Node = client.music.shoukaku.getNode();
//         const Result = await Music.searchAndPlay(
//             Node,
//             args.join(" "),
//             `youtube`,
//             message
//         );
//         if (!Result) return;
//         message.channel.send(
//             Result.isPlaylist
//                 ? `Loaded ${Result.playlistName} playlist which has ${Result.tracks.length} songs`
//                 : `Loaded ${Result.songInfo.title} by ${Result.songInfo.author}`
//         );
//     }
// }