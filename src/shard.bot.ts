import { Events, IntentsBitField, Message, type Interaction } from 'discord.js';
import { Client } from 'discordx';
import * as StartUtils from './utility/startUtils';
import { randomUUIDv7 } from 'bun';
import loggerService from 'service/loggerService';
import 'command/commands';

if (!StartUtils.validateBotToken(process.env['DISCORD_TOKEN'])) {
    process.exit(1);
}

export const logger = loggerService.child({
    name: 'shard',
    module: 'shard',
    shardId: 'shard',
    executionId: randomUUIDv7(),
});

export const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.MessageContent,
    ],
    silent: false,
    guards: [], // TODO Add guards here
});

client.on(Events.ClientReady, async () => {    
    // await client.clearApplicationCommands();
    await client.initApplicationCommands();
});

client.on(Events.InteractionCreate, (interaction: Interaction) => {
    client.executeInteraction(interaction);
});

client.on(Events.MessageCreate, (message: Message) => {
    client.executeCommand(message);
});

await client.login(process.env['DISCORD_TOKEN']);

export default client;