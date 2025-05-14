import { Request } from 'express';
import { inject, injectable } from 'inversify';
import { interfaces } from 'inversify-express-utils';
import { SERVICE } from '../types';
import { IAuthService } from '../model/auth-service';
import { AnonymousPrincipal } from './principals/anonymous';
import { UserPrincipal } from './principals/user';

@injectable()
export class AuthProvider implements interfaces.AuthProvider {
    @inject(SERVICE.auth) private authService!: IAuthService;

    public async getUser(request: Request): Promise<interfaces.Principal> {
        try {
            const authorizationHeader = request.headers.authorization;

            if (authorizationHeader === undefined) {
                return new AnonymousPrincipal();
            }

            if (authorizationHeader.startsWith('Bearer ')) {
                const token = authorizationHeader.slice(7);
                const decodedAuthToken = await this.authService.verifyToken(token);
                return new UserPrincipal(decodedAuthToken);
            }

            return new AnonymousPrincipal();
        } catch {
            return new AnonymousPrincipal();
        }
    }
}
