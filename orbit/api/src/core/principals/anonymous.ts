/* eslint-disable @typescript-eslint/no-unused-vars */

import { Principal } from 'inversify-express-utils';

export class AnonymousPrincipal implements Principal {
    details = undefined;

    async isAuthenticated(): Promise<boolean> {
        return Promise.resolve(false);
    }

    async isInRole(role: string): Promise<boolean> {
        return Promise.resolve(false);
    }

    async isResourceOwner(resourceId: unknown): Promise<boolean> {
        return Promise.resolve(false);
    }
}
