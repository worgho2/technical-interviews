/* eslint-disable @typescript-eslint/no-unused-vars */

import { Principal } from 'inversify-express-utils';
import { DecodedAuthToken } from '../../model/decoded-auth-token';

export class UserPrincipal implements Principal {
    details: DecodedAuthToken;

    constructor(details: DecodedAuthToken) {
        this.details = details;
    }

    async isAuthenticated(): Promise<boolean> {
        return Promise.resolve(true);
    }

    async isInRole(role: string): Promise<boolean> {
        return Promise.resolve(false);
    }

    async isResourceOwner(resourceId: unknown): Promise<boolean> {
        return Promise.resolve(false);
    }
}
