// 環境変数の読み込み
const { INSTANCE_ID, ACCESS_KEY, SECRET_ACCESS_KEY, REGION, USHIDA_ID } = require('../config.json');
const params = {
    InstanceIds: [INSTANCE_ID],
};
// SlashCommandBuilder、Clientの読み込み
const { SlashCommandBuilder } = require('discord.js');
// aws-sdkの読み込み
const { EC2Client, DescribeInstancesCommand } = require('@aws-sdk/client-ec2')
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
        .setName('getstatus')
        .setDescription('Palworldのサーバーの状態を確認します'),
    execute: async function(interaction) {
        try{
            const d = new Date();
            const year = d.getFullYear();
            const month = `0${d.getMonth() + 1}`.slice(-2);
            const launchTimePattern = `${year}-${month}-*`;
            const command = new DescribeInstancesCommand({
                Filters: [
                    { Name: 'architecture', Values: ['x86_64'] },
                    { Name: 'instance-state-name', Values: ['running'] },
                    {
                        Name: 'launch-time',
                        Values: [launchTimePattern],
                    },
                ],
            });

            const { Reservations } = await ec2.send(command);
            const instanceList = Reservations.reduce((prev, current) => {
                return prev.concat(current.Instances);
            }, []);
            console.log("Getting state:");
            console.log(instanceList.join("\n"));
            interaction.reply({ content: 'Instance Status:' + instanceList, ephemeral: true });
        } catch(err) {
            console.log('Failed to get status：')
            console.log(err);
            console.log(err.stack);
            interaction.reply({ content: 'Failed to get status', ephemeral: true });
        };
    },
};