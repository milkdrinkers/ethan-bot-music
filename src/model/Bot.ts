import { $, randomUUIDv7 } from 'bun';
import { ShardEvents, ShardingManager } from 'discord.js';
import loggerService from 'service/loggerService';
import * as StartUtils from 'utility/startUtils';

export default class Bot {
    private _shardManager: ShardingManager;

    public get shardManager() {
        return this._shardManager;
    }

    constructor() {
        if (!StartUtils.validateBotToken(process.env['DISCORD_TOKEN'])) {
            process.exit(1);
        }

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


            });


        // Spawn shard
        this.shardManager.spawn({
            amount: 1,
        });
    }
}