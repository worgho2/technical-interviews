import { Request, Response, NextFunction } from 'express';
import { injectable } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';
import { ApiError } from '../../model/api-error';

@injectable()
export class AuthenticatedMiddleware extends BaseMiddleware {
    async handler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const principal = this.httpContext.user;
            const isAuthenticated = await principal.isAuthenticated();

            if (!isAuthenticated) {
                throw new ApiError('403_FORBIDDEN', 'Forbidden: You are not authenticated');
            }

            next();
        } catch (error) {
            next(error);
        }
    }
}
