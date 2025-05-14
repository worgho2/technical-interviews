import { inject } from 'inversify';
import { BaseHttpController, httpGet, controller, principal } from 'inversify-express-utils';
import { CORE, SERVICE } from '../types';
import { IUserService } from '../service/user';
import { UserPrincipal } from '../core/principals/user';

@controller('/users')
export class UserController extends BaseHttpController {
    constructor(@inject(SERVICE.user) private userService: IUserService) {
        super();
    }

    @httpGet('/:userId', CORE.MIDDLEWARE.authenticated)
    async getUser(@principal() userPrincipal: UserPrincipal) {
        const userId = userPrincipal.details.id;
        const user = await this.userService.getUserById(userId);
        return this.json(user, 200);
    }
}
