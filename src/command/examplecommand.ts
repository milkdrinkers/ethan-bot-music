import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js';
import { Discord, Slash, SlashGroup, SlashOption } from 'discordx';

/**
 * Command that does nothing.
 */
@Discord()
export default abstract class Example {
    @Slash({ description: "A command that does nothing." })
    private async test(
        @SlashOption({
            name: 'number',
            description: 'Some random description.',
            required: true,
            type: ApplicationCommandOptionType.Number,
        }) number: number,
        @SlashOption({
            name: 'text',
            description: 'Some random description.',
            required: true,
            type: ApplicationCommandOptionType.String,
        }) text: string,
        interaction: CommandInteraction
    ) {
        // Do something!
        await interaction.deferReply(); // It is vital to defer the reply if response will take more than a few seconds
        
        await interaction.followUp({
            embeds: [
                {
                    description: 'Lorem ipsum dolor sit amet...',
                    color: 0xb84e44
                }
            ],
            ephemeral: true
        })
    }
}