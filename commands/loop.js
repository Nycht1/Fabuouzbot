const { GuildMember, ApplicationCommandOptionType } = require('discord.js');
const { QueueRepeatMode, useQueue } = require('discord-player');
const { isInVoiceChannel } = require("../utils/voicechannel");

module.exports = {
    name: 'loop',
    description: 'Looping lagu yang sekarang dimainin.',
    options: [
        {
            name: 'mode',
            type: ApplicationCommandOptionType.Integer,
            description: 'Loop type',
            required: true,
            choices: [
                {
                    name: 'Off',
                    value: QueueRepeatMode.OFF,
                },
                {
                    name: 'Track',
                    value: QueueRepeatMode.TRACK,
                },
                {
                    name: 'Queue',
                    value: QueueRepeatMode.QUEUE,
                },
                {
                    name: 'Autoplay',
                    value: QueueRepeatMode.AUTOPLAY,
                },
            ],
        },
    ],
    async execute(interaction) {
        try {
            const inVoiceChannel = isInVoiceChannel(interaction)
            if (!inVoiceChannel) {
                return
            }

            await interaction.deferReply();

            const queue = useQueue(interaction.guild.id)
            if (!queue || !queue.currentTrack) {
                return void interaction.followUp({ content: '❌ | Lagi ga ada musik yang playing.' });
            }

            const loopMode = interaction.options.getInteger('mode');
            queue.setRepeatMode(loopMode);
            const mode = loopMode === QueueRepeatMode.TRACK ? '🔂' : loopMode === QueueRepeatMode.QUEUE ? '🔁' : '▶';

            return void interaction.followUp({
                content: `${mode} | Loop mode terupdate.`,
            });
        } catch (error) {
            console.log(error);
            return void interaction.followUp({
                content: 'Terjadi error pas running tu command: ' + error.message,
            });
        }
    },
};
