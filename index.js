const fs = require('node:fs');
const path = require('node:path');

// discord.jsライブラリから必要な設定を呼び出し
const { Client, GatewayIntentBits, Events, Collection } = require('discord.js');
// Discord Token
const { DISCORD_TOKEN } = require('./config.json');
// クライアントインスタンス
const client = new Client({
    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages
    ] 
});
require('dotenv').config();


// コマンドファイルを取得して保持
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// 取得した.jsファイル内の情報から、コマンドと名前をListenner-botに対して設定
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING]  ${filePath} のコマンドには、必要な "data" または "execute" プロパティがありません。`);
	};
};

/**
 * 起動時のログ
 */
client.once(Events.ClientReady, async () => {
    console.log(`Logged in as ${client.user.tag}`);
});

/**
 * Interactionが起こったとき
 */
client.on(Events.InteractionCreate, async interaction => {
    // スラッシュコマンド以外の場合すぐにreturn
    if(!interaction.isChatInputCommand()) {
        return;
    };
    const command = interaction.client.commands.get(interaction.commandName);
    // スラッシュコマンドの処理
    if(command) {
        try {
            await command.execute(interaction);
        } catch(error) {
            console.error(error);
            if(interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'コマンド実行時にエラーが発生しました。' + error, ephemeral: false });
            } else {
                await interaction.reply({ content: 'コマンド実行時にエラーが発生しました。' + error, ephemeral: false });
            }
        }
    } else {
        console.error(`${interaction.commandName}のコマンドには対応していません。`)
    }
});

/**
 * ログイン
 */
client.login(DISCORD_TOKEN);