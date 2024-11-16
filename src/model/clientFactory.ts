import { IntentsBitField } from 'discord.js';
import { Client } from 'discordx';
import loggerService from 'service/loggerService';

export const clientFactory = (executionId: string) => {
    const logger = loggerService.child({ // Setup logger
        name: 'clientFactory',
        module: 'clientFactory',
        shardId: 'shard',
        executionId: executionId,
    });
    
    try {
        const client = new Client({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.GuildVoiceStates,
                IntentsBitField.Flags.GuildPresences,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.GuildMessageReactions,
                IntentsBitField.Flags.MessageContent,
                IntentsBitField.Flags.GuildVoiceStates,
            ],
            silent: false,
            guards: [], // TODO Add guards here
        });

        return client;
    } catch (error) {
        logger.error(error, "Failed to create discord client!")
        throw new Error("Failed to create discord client!");
    }
};
export default clientFactory;