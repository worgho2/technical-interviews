import Joi from 'joi';

export type DecodedAuthToken = {
    id: string;
};

export const decodedAuthTokenSchema = Joi.object<DecodedAuthToken>({
    id: Joi.string().required(),
}).required();
