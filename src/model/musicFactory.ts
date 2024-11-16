import type { Client } from 'discordx';
import { MusicController } from './musicController';
import loggerService from 'service/loggerService';

export const musicFactory = async (client: Client, executionId: string) => {
    const logger = loggerService.child({ // Setup logger
        name: 'musicFactory',
        module: 'musicFactory',
        shardId: client.shard?.ids[0],
        executionId: executionId,
    });

    try {
        const musicController = new MusicController(client, executionId);

        await musicController.init();

        return musicController;
    } catch (error) {
        logger.error(error, "Failed to create music controller!")
        throw new Error("Failed to create music controller!");
    }
};
export default musicFactory;