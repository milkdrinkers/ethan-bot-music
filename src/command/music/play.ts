import { ApplicationCommandOptionType, ChannelType, CommandInteraction, Guild, GuildMember } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { shard } from 'shard.bot';

/**
 * Command that does nothing.
 */
@Discord()
export default abstract class Play {
    @Slash({ description: "A command that does nothing." })
    private async play(
        @SlashOption({
            name: 'text',
            description: 'Song link.',
            required: true,
            type: ApplicationCommandOptionType.String,
        }) text: string,
        interaction: CommandInteraction
    ) {
        if (!(interaction.member instanceof GuildMember)) return;
        if (!(interaction.guild instanceof Guild)) return;
        if (!(interaction.channel?.type === ChannelType.GuildText)) return;

        const { music, logger } = shard;

        const player = music.player;
        const channel = interaction.member.voice.channel;

        if (!channel){
            interaction.reply({
                embeds: [
                    {
                        description: 'You are not connected to a voice channel!',
                        color: 0xb84e44
                    }
                ],
                ephemeral: true
            })
            return;
        }


        // Do something!
        await interaction.deferReply(); // It is vital to defer the reply if response will take more than a few seconds
        
        try {
            // const res = await player.search(text, {
            //     searchEngine: QueryType.YOUTUBE_VIDEO
            // });

            const { track } = await player.play(channel, text, {

                nodeOptions: {
                    // nodeOptions are the options for guild node (aka your queue in simple word)
                    metadata: interaction // we can access this metadata object using queue.metadata later on
                }
            });
        } catch (error) {
            logger.error(error);
            await interaction.followUp({
                embeds: [
                    {
                        description: 'Lorem ipsum dolor sit amet...',
                        color: 0xb84e44
                    }
                ],
                ephemeral: true
            })
            return
        }
        await interaction.followUp({
            embeds: [
                {
                    description: 'Good!',
                    color: 0xb84e44
                }
            ],
            ephemeral: true
        })
        
    }
}