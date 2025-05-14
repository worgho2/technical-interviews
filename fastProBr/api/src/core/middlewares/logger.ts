import { Request, Response, NextFunction } from 'express';
import { injectable } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';
import { ILogger } from '../logger';
import { CORE } from '../../types';
import morgan from 'morgan';
import { container } from '../../container';

@injectable()
export class LoggerMiddleware extends BaseMiddleware {
    handler(req: Request, res: Response, next: NextFunction): void {
        const logger = container.get<ILogger>(CORE.logger);

        morgan(
            ':remote-addr - :remote-user ":method :url" :status :response-time ms :res[content-length] ":referrer" ":user-agent"',
            {
                stream: {
                    write: (message: string) => logger.info(message),
                },
            },
        )(req, res, next);
    }
}
