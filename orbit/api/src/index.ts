import '@abraham/reflection';
import { InversifyExpressServer, RoutingConfig } from 'inversify-express-utils';
import { container } from './container';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { IConfig } from './core/config';
import { CORE } from './types';
import { AuthProvider } from './core/auth-provider';
import { ApiError } from './model/api-error';
import cors from 'cors';
import { LoggerMiddleware } from './core/middlewares/logger';
import { ILogger } from './core/logger';

const config = container.get<IConfig>(CORE.config);
const logger = container.get<ILogger>(CORE.logger);
const loggerMiddleware = container.get<LoggerMiddleware>(CORE.MIDDLEWARE.logger);

const routingConfig: RoutingConfig = {
    rootPath: '/api',
};

const inversifyServer = new InversifyExpressServer(container, null, routingConfig, null, AuthProvider);

inversifyServer.setConfig((app) => {
    app.use(loggerMiddleware.handler);
    app.use(cors());
    app.use(helmet());
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
});

inversifyServer.setErrorConfig((app) => {
    app.use((req: Request, res: Response, next: NextFunction) => {
        next(new ApiError('404_NOT_FOUND', 'Not Found'));
    });

    app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
        let statusCode = 500;
        let message = ApiError.getUnhandlerErrorMessage();

        if (err instanceof ApiError) {
            statusCode = err.statusCode;
            message = err.getResponseMessage();
        }

        logger.error(`${message.message}`);
        res.status(statusCode).json(message);
        next();
    });
});

const app = inversifyServer.build();

const server = app.listen(config.env.PORT, () => {
    logger.debug(`Server started on port ${config.env.PORT}`);
});

/**
 * Graceful shutdown
 */
process.on('SIGTERM', () => {
    server.close();
    process.exit(0);
});
