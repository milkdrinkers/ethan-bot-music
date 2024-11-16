import closeWithGrace from 'close-with-grace';
import Bot from 'model/bot';
import loggerService from 'service/loggerService';

import 'service/monitorService';
import 'service/translationsService';

// Handle graceful shutdown (Used to prevent node exiting before flushing logs)
closeWithGrace(
    { 
        logger: { error: (m) => loggerService.error(m, 'Shutting down bot due to fatal error!') }
    }, async ({ signal, err }) => {
        if (err) {
            loggerService.error(err, `${signal} received, shutting down bot with fatal error.`)
        } else {
            loggerService.info(`${signal} received, shutting down bot.`)
        }

        process.exit(0); // Calling exit manually ensure log files are saved
    }
)

const bot = new Bot();
bot.start();
