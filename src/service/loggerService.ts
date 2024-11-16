import pino from 'pino';

interface Logger {
    target: string,
    level?: string,
    options?: {
        destination?: string,
        ignore?: string,
        sync?: boolean,
        colorize?: boolean,
        mkdir?: boolean,
        path?: string,
        pattern?: string,
        maxSize?: number,
        fsync?: boolean,
        append?: boolean,
    },
}

const loggers: Logger[] = [
    { 
        target: '@jvddavid/pino-rotating-file', // Combined log file
        level: 'trace',
        options: {
            path: "./logs",
            pattern: "combined-%Y-%M-%d-%N.log",
            maxSize: 1024 * 1024 * 10,
            sync: false,
            fsync: false,
            append: true,
            mkdir: true,
        }
    },
    {
        target: '@jvddavid/pino-rotating-file', // Error log file
        level: 'error',
        options: {
            path: "./logs",
            pattern: "error-%Y-%M-%d-%N.log",
            maxSize: 1024 * 1024 * 10,
            sync: false,
            fsync: false,
            append: true,
            mkdir: true,
        }
    }
];

// Add pino-pretty or base pino for logging to console
try {
    // Check if pino-pretty is available or throw
    require.resolve('pino-pretty'); 

    // Use pino-pretty if it is available
    loggers.push(
        {
            target: 'pino-pretty',
            options: {
                colorize: true,
                ignore: 'environment,source,module,action,name,context,executionId,shardId,pid,hostname'
            }
        }
    )
} catch (error) {
    // Use normal logging format for console
    loggers.push( 
        {
            target: 'pino/file',
            options: {
                colorize: true,
                sync: false,
                ignore: 'environment,source,module,action,name,context,executionId,shardId,pid,hostname'
            }
        }
    )
}

const loggerService = pino(
    { 
        level: process.env['LOG_LEVEL'] ?? 'info', // Parse user minimum log level
        timestamp: pino.stdTimeFunctions.isoTime, // Output time in ISO format
    }, 
    pino.transport({ targets: loggers })
);
export default loggerService;