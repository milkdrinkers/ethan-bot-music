import { Events, Message, type Interaction } from 'discord.js';
import * as StartUtils from 'utility/startUtils';
import { randomUUIDv7 } from 'bun';
import loggerService from 'service/loggerService';
import 'command/commands';
import musicFactory from 'model/musicFactory';
import clientFactory from 'model/clientFactory';
import type { Client } from 'discordx';
import type { MusicController } from 'model/musicController';
import type { Player } from 'discord-player';
import 'command/commands'; // Import commands for the bot

/**
 * The Shard class holds all data for each shard
 */
export default class Shard {
    private _executionId = randomUUIDv7(); // Generated executionId for this shard
    private _logger = loggerService.child({ // Unique logging instance for this shard
        name: 'shard',
        module: 'shard',
        shardId: 'shard',
        executionId: this.executionId,
    });
    private _client?: Client; // discord.js client instance for this shard
    private _music?: MusicController; // MusicController instance for this shard
    private isRunnng = false; // Tracks if this shard has been started

    /**
     * Used to start the shard
     * @returns client and music controiller
     */
    private async startInternal() {
        try {
            if (!StartUtils.validateBotToken(process.env['DISCORD_TOKEN'])) {
                process.exit(1);
            }
    
            const client = clientFactory(this.executionId);
            const music = await musicFactory(client, this.executionId);
        
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
        
            return { _client: client, _music: music };
        } catch (error) {
            this.logger.error(error, "Failed to start shard!")
            process.exit(1);
        } 
    }

    /**
     * Public method for starting this shard instance
     */
    public async start() {
        if (this.isRunnng) {
            this.logger.warn('Attempted to start already running shard.')
            return;
        }

        const { _client, _music } = await this.startInternal(); 
        this._client = _client;
        this._music = _music;

        this.isRunnng = true;
    }

    // Getters / Setters

    /**
     * Get the unique execution id of this shard
     *
     * @readonly
     */
    public get executionId() {
        return this._executionId;
    }
    
    /**
     * Gets the logger instance associated with this shard
     *
     * @readonly
     */
    public get logger() {
        return this._logger;
    }

    /**
     * Internally gets the discord.js client instance of this shard
     *
     * @readonly
     * @type {Client}
     */
    public get client(): Client {
        if (!this._client)
            throw new Error('Error in shard, client is undefined!');
        return this._client;
    }

    /**
     * Internally gets the music controller instance of this shard
     *
     * @readonly
     * @type {MusicController}
     */
    public get music(): MusicController {
        if (!this._music)
            throw new Error('Error in shard, music controller is undefined!');
        return this._music;
    }

    /**
     * Internally gets the discord player instance, from the music controller of this shard
     *
     * @readonly
     * @type {Player}
     */
    public get player(): Player {
        if (!this._music)
            throw new Error('Error in shard, music controller is undefined!');
        return this._music?.player;
    }
}