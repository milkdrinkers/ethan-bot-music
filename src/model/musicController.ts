import { GuildQueue, Player, Track } from 'discord-player';
import { YoutubeiExtractor, type YoutubeiOptions } from 'discord-player-youtubei';
import type { Client } from 'discordx';
import loggerService from 'service/loggerService';

export class MusicController {
    private _player: Player;
    private _musicLogger;

    public get player() {
        return this._player;
    }

    public get logger() {
        return this._musicLogger;
    }
    
    constructor(client: Client, executionId: string) {
        this._musicLogger = loggerService.child({ // Setup logger
            name: 'music',
            module: 'music',
            shardId: client.shard?.ids[0],
            executionId: executionId,
        });

        this._player = new Player(
            client, {
                skipFFmpeg: false,
                useLegacyFFmpeg: false, // Encourage use of modern versions with fewer issues
                // ipconfig: undefined, // TODO Allow configuration of ip rotation
            }
        );
    }

    /**
     * This has to be executed to register extractors and attach the logging service to discord-player.
     */
    public async init() {
        await this.player.extractors.register(YoutubeiExtractor, {
            authentication: /* process.env['DP_YT_CLIENT_CREDENTIALS'] ?? */ undefined, // FIX Auth is broken in the plugin currently, wait for fix
            overrideBridgeMode: 'yt',
            streamOptions: {
                useClient: 'IOS',
                highWaterMark: 5 * 1024 * 1024 // 2MB, default is 512 KB (512 * 1_024)
            }
            // streamOptions: {
            //     useClient: "ANDROID",
            // }
        } as YoutubeiOptions)

        await this.player.extractors.loadDefault((ext) => !["YouTubeExtractor"].includes(ext))

        // Log dependencies
        // this.logger.debug(DependencyReportGenerator.generateString()); // V7
        this.logger.debug(`Music player deps: \n\n${this.player.scanDeps()}`);

        // Log event listeners
        this.attachLogging();
    }

    private attachLogging() {
        this.player.events.on('connection', (queue: GuildQueue) => {
            this.logger.info(`[${queue.guild.name}] Joined server.`);
        });

        this.player.events.on('emptyChannel', (_queue: GuildQueue<unknown>) => {});

        this.player.events.on('disconnect', (queue: GuildQueue) => {
            this.logger.info(`[${queue.guild.name}] Left server.`);
        });

        this.player.events.on('emptyQueue', (queue: GuildQueue) => {
            this.logger.info(`[${queue.guild.name}] Guild Queue is empty.`);
        });

        this.player.events.on('audioTrackAdd', (queue: GuildQueue, track: Track) => {
            this.logger.info(`[${queue.guild.name}] Queued "${track.cleanTitle}".`);
        });

        this.player.events.on('audioTracksAdd', (queue: GuildQueue, track: Track[]) => {
            const tracks = track.map((val: Track, index: number) => {
                if (index !== track.length) return `${val.cleanTitle}`;
                return `${val.cleanTitle}`;
            });

            this.logger.info(`[${queue.guild.name}] Queued bulk "${tracks}".`);
        });

        this.player.events.on('audioTrackRemove', (queue: GuildQueue, track: Track) => {
            this.logger.info(`[${queue.guild.name}] Unqueued "${track.cleanTitle}".`);
        });

        this.player.events.on('audioTracksRemove', (queue: GuildQueue, track: Track[]) => {
            const tracks = track.map((val: Track, index: number) => {
                if (index !== track.length) return `${val.cleanTitle}`;
                return `${val.cleanTitle}`;
            });

            this.logger.info(`[${queue.guild.name}] Unqueued bulk "${tracks}".`);
        });

        this.player.events.on('playerStart', (queue: GuildQueue, track: Track) => {
            this.logger.info(`[${queue.guild.name}] Soundtrack started "${track.cleanTitle}".`);
        });

        this.player.events.on('playerSkip', (queue: GuildQueue, track: Track) => {
            this.logger.info(`[${queue.guild.name}] Soundtrack skipped "${track.cleanTitle}".`);
        });

        this.player.events.on('playerFinish', (queueOrg: GuildQueue, track: Track) => {
            this.logger.info(`[${queueOrg.guild.name}] Soundtrack ended "${track.cleanTitle}".`);
        });

        this.player.events.on('error', (queue: GuildQueue, error: Error) => {
            this.logger.error(error, `[${queue.guild.name}] Error: ${error.message}`);
        });

        this.player.events.on('playerError', (queue: GuildQueue, error: Error, track: Track) => {
            this.logger.error(error, `[${queue.guild.name}] Soundtrack error "${track.cleanTitle}": ${error.message}`);
        });

        this.player.events.on('debug', (queue: GuildQueue, message: string) => {
            this.logger.debug(`[${queue.guild.name}] "${message}".`);
        });
    }
}