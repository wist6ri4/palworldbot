/**
 * スラッシュコマンドをサーバーに登録
 */
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');

const commands = [];
// commandsフォルダから、.jsで終わるファイルのみを取得
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
};
// config.jsonからの読み込み
const { DISCORD_TOKEN, APPLICATION_ID, GUILD_ID } = require('./config.json');
// discordAPI
const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);
// スラッシュコマンドの登録
(async() => {
    try {
        console.log(commands, APPLICATION_ID, GUILD_ID);
        await rest.put(
            Routes.applicationGuildCommands(APPLICATION_ID, GUILD_ID),
            { body: commands },
        );
        console.log('コマンドの登録が完了しました。');
    } catch(error) {
        console.error('コマンド登録中にエラーが発生しました。:' + error);
    }
})();
