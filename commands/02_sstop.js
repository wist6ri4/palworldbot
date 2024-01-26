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
 * SStop
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('sstop')
        .setDescription('Palworldのサーバーを停止します'),
    execute: async function(interaction) {
        const command = new StopInstancesCommand(params);

        try{
            const { StoppingInstances } = await ec2.send(command);
            const instanceIdList = StoppingInstances.map(
                (instance) => '・ ${instance.InstanceId}',
            );
            console.log("Stopping Instances:");
            console.log(instanceIdList.join("\n"));
            interaction.channel.send(`${USHIDA_ID}\nInstance stopped!`);
        } catch(err) {
            console.log('Failed to stop Instance：')
            console.log(err);
            console.log(err.stack);
            interaction.channel.send('Failed to stop Instance：\n' +  err);
        };
    },
};