// 環境変数の読み込み
const { INSTANCE_ID, ACCESS_KEY, SECRET_ACCESS_KEY, REGION, USHIDA_ID } = require('../config.json');
const params = {
    InstanceIds: [INSTANCE_ID],
};
// SlashCommandBuilder、Clientの読み込み
const { SlashCommandBuilder } = require('discord.js');
// aws-sdkの読み込み
const { EC2Client, DescribeInstanceStatusCommand } = require('@aws-sdk/client-ec2')
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
            const command = new DescribeInstanceStatusCommand(params);
            const response = await ec2.send(command);

            console.log("Getting state:");
            console.log(response);
            if(response.InstanceStatuses.length > 0) {
                const instance = response.InstanceStatuses[0];
                interaction.reply({
                    content:
                        '[Instance Status]\n'
                        + 'State: Running\n'
                        + 'InstanceId: ' + (instance.InstanceId.slice(0, 10) + '\*\*\*\*\*\*\*\*\*\*') + '\n'
                        + 'Availability Zone: ' + instance.AvailabilityZone + '\n',
                    ephemeral: true,
                });
            } else {
                interaction.reply({
                    content:
                        '[Instance Status]\n'
                        + 'State: Stopped',
                    ephemeral: true, 
                });
            };
        } catch(err) {
            console.log('Failed to get status：')
            console.log(err);
            console.log(err.stack);
            interaction.reply({ content: 'Failed to get status', ephemeral: true });
        };
    },
};