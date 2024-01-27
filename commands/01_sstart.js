// 環境変数の読み込み
const { INSTANCE_ID, ACCESS_KEY, SECRET_ACCESS_KEY, REGION, USHIDA_ID } = require('../config.json');
const params = {
    InstanceIds: [INSTANCE_ID],
};
// SlashCommandBuilder、Clientの読み込み
const { SlashCommandBuilder } = require('discord.js');
// aws-sdkの読み込み
const { EC2Client, StartInstancesCommand } = require('@aws-sdk/client-ec2')
const ec2 = new EC2Client({
    region: REGION,
    credentials: {
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_ACCESS_KEY
    },
});

/**
 * SStart
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('sstart')
        .setDescription('Palworldのサーバーを起動します'),
    execute: async function(interaction) {
        const command = new StartInstancesCommand(params);

        try{
            const { StartingInstances } = await ec2.send(command);
            const instanceIdList = StartingInstances.map(
                (instance) => `・${instance.InstanceId}`,
            );
            console.log("Starting Instances:");
            console.log(instanceIdList.join("\n"));
            interaction.reply(`${USHIDA_ID}\nInstance started!`);
        } catch(err) {
            console.log('Failed to start Instance：')
            console.log(err);
            console.log(err.stack);
            interaction.reply('Failed to start Instance：\n' +  err);
        };
    },
};