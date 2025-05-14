import { inject } from 'inversify';
import { BaseHttpController, controller, httpPost, request } from 'inversify-express-utils';
import { SERVICE } from '../types';
import { Request } from 'express';
import Joi from 'joi';
import { getValidated } from '../utils/data-validation';
import { IAuthService } from '../model/auth-service';

@controller('/auth')
export class AuthController extends BaseHttpController {
    constructor(@inject(SERVICE.auth) private authService: IAuthService) {
        super();
    }

    @httpPost('/signup')
    async signUp(@request() req: Request) {
        type BodyPayload = {
            name: string;
            email: string;
            hashedPassword: string;
            phone: string;
        };

        const bodyPayloadSchema = Joi.object<BodyPayload>({
            name: Joi.string().required(),
            email: Joi.string().required(),
            hashedPassword: Joi.string().required(),
            phone: Joi.string().required(),
        }).required();

        const body = await getValidated<BodyPayload>(bodyPayloadSchema, req.body, {
            abortEarly: true,
            stripUnknown: true,
        });

        const user = await this.authService.signUp(body);
        return this.json(user, 201);
    }

    @httpPost('/signin')
    async signIn(@request() req: Request) {
        type BodyPayload = {
            email: string;
            hashedPassword: string;
        };

        const bodyPayloadSchema = Joi.object<BodyPayload>({
            email: Joi.string().required(),
            hashedPassword: Joi.string().required(),
        }).required();

        const body = await getValidated<BodyPayload>(bodyPayloadSchema, req.body, {
            abortEarly: true,
            stripUnknown: true,
        });

        const data = await this.authService.signIn(body.email, body.hashedPassword);
        return this.json(data, 200);
    }
}
