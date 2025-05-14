import { injectable } from 'inversify';
import * as winston from 'winston';

export interface ILogger {
    debug(message: string, metadata?: unknown): void;
    info(message: string, metadata?: unknown): void;
    warn(message: string, metadata?: unknown): void;
    error(message: string, metadata?: unknown): void;
}

@injectable()
export class Logger implements ILogger {
    constructor() {
        this.defaultLogger = winston.createLogger({
            transports: [
                new winston.transports.Console({
                    level: 'debug',
                    format: winston.format.combine(
                        winston.format.timestamp({ format: 'YY-MM-DD HH:mm:ss' }),
                        winston.format.printf(
                            (info) => `${info.timestamp as string} [${info.level}]: ${String(info.message)}`,
                        ),
                        winston.format.colorize({
                            all: true,
                            colors: {
                                error: 'red',
                                warn: 'yellow',
                                info: 'green',
                                debug: 'blue',
                            },
                        }),
                    ),
                }),
            ],
        });
    }

    defaultLogger: winston.Logger;

    debug(message: string, metadata?: unknown): void {
        this.defaultLogger.debug(message, metadata);
    }

    info(message: string, metadata?: unknown): void {
        this.defaultLogger.info(message, metadata);
    }

    warn(message: string, metadata?: unknown): void {
        this.defaultLogger.warn(message, metadata);
    }

    error(message: string, metadata?: unknown): void {
        this.defaultLogger.error(message, metadata);
    }
}
