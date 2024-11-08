import { ShardEvents, ShardingManager } from 'discord.js';
import pino from 'pino';
import * as StartUtils from 'utility/startUtils';

export default class Bot {
    private _shardManager: ShardingManager;
    private _logger = pino();

    public get shardManager() {
        return this._shardManager;
    }

    public get logger() {
        return this._logger;
    }
    
    constructor() {
        if (!StartUtils.validateBotToken(process.env['DISCORD_TOKEN'])) {
            process.exit(1);
        }

        this._shardManager = new ShardingManager("./src/shard.bot.ts", {
            token: process.env['DISCORD_TOKEN'],
        });
    }

    start(): void {
        this.shardManager.on("shardCreate", (shard) => {
            // TODO Init shard logger
            this.logger.child({
                name: 'main',
                module: 'main',
                shardId: shard.id,
                executionId: shard.id,
            });

            // TODO Link DB


            console.log(`Launched shard ${shard.id}`);


            shard.on(ShardEvents.Death, (e) => {

            });

            shard.on(ShardEvents.Disconnect, () => {

            });

            shard.on(ShardEvents.Error, (e) => {

            });

            shard.on(ShardEvents.Message, (e) => {

            });

            shard.on(ShardEvents.Ready, () => {

            });

            shard.on(ShardEvents.Reconnecting, () => {

            });

            shard.on(ShardEvents.Resume, () => {

            });

            shard.on(ShardEvents.Spawn, (e) => {

            });

        });
        
        this.shardManager.spawn({
            amount: 1,
        });
    }
}