import pino from 'pino';

const loggerService = pino({}, pino.transport(
    {
        target: 'pino-pretty',
        options: {
            colorize: true,
            ignore: 'environment,source,module,action,name,context,executionId,shardId,pid,hostname'
        }
    }
));
export default loggerService;