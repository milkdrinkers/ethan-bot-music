import { $, randomUUIDv7 } from 'bun';
import { ShardEvents, ShardingManager } from 'discord.js';
import loggerService from 'service/loggerService';
import * as StartUtils from 'utility/startUtils';

/**
 * The Bot class manages the lifecycle, logs and sharding for the bot
 */
export default class Bot {
    private _shardManager: ShardingManager;

    /**
     * Get the sharding manager instance for this bot
     *
     * @readonly
     */
    public get shardManager() {
        return this._shardManager;
    }

    constructor() {
        // Check discord api token
        if (!StartUtils.validateBotToken(process.env['DISCORD_TOKEN'])) {
            process.exit(1);
        }

        // Instantiate sharding manager
        this._shardManager = new ShardingManager("./src/shard.bot.ts", {
            token: process.env['DISCORD_TOKEN'],
        });
    }

    async start() {
        // Manage event handling for new shards
        this.shardManager.on("shardCreate", (shard) => {
            // Create a shard manager logger instance
            const logger = loggerService.child({
                name: 'main',
                module: 'main',
                shardId: 'main',
                executionId: randomUUIDv7(),
            });

            // TODO Link DB

            logger.info(`(Shard #${shard.id}): Shard created.`);

            shard.on(ShardEvents.Message, (e) => {
                logger.info(e, `(Shard #${shard.id}): `)
            });

            shard.on(ShardEvents.Error, (e) => {
                logger.error(e, `(Shard #${shard.id}): Shard error!`)
            });

            // Lifetime Events

            shard.on(ShardEvents.Reconnecting, () => {
                logger.info(`(Shard #${shard.id}): Shard reconnecting.`)
            });

            shard.on(ShardEvents.Resume, () => {
                logger.info(`(Shard #${shard.id}): Shard reconnected.`)
            });

            shard.on(ShardEvents.Disconnect, () => {
                logger.warn(`(Shard #${shard.id}): Shard disconnected.`)
            });

            // Lifecycle Events

            shard.on(ShardEvents.Spawn, (_e) => {
                logger.info(`(Shard #${shard.id}): Shard spawned.`)
            });

            shard.on(ShardEvents.Ready, () => {
                logger.info(`(Shard #${shard.id}): Shard ready.`)
            });

            shard.on(ShardEvents.Death, (e) => {
                logger.fatal(e, `(Shard #${shard.id}): Shard died for unknown reason!`)
            });
        });

        // Discord Player FFmpeg check
        const output = await $`ffmpeg -version`
            .nothrow()
            .quiet();

        const logger = loggerService.child({
            name: 'main',
            module: 'main',
            shardId: 'main',
        });

        logger.debug(`FFmpeg version command output: \n\n${output.text()}`);

        if (output.exitCode !== 0) {
            logger.error('Ethan requires FFmpeg but is not installed on your system.\nInstall FFmpeg from the website https://ffmpeg.org/download.html and try again.\nIf on Windows, ensure FFmpeg is abailable on your PATH.')
            process.exit(1);
        }

        // Spawn shard
        this.shardManager.spawn({
            // amount: 1, // TODO Args here
        });
    }
}