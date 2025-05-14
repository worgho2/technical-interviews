import { AnySchema, ValidationError } from 'joi';
import { ApiError } from '../model/api-error';

export async function getValidated<T>(
    schema: AnySchema<unknown>,
    object: unknown,
    options?: {
        abortEarly?: boolean;
        stripUnknown?: boolean;
    },
): Promise<T> {
    try {
        return (await schema.validateAsync(object, {
            abortEarly: options?.abortEarly,
            stripUnknown: options?.stripUnknown,
        })) as T;
    } catch (error) {
        const message = error instanceof ValidationError ? error.message : 'Unknown validation error';
        throw new ApiError('400_BAD_REQUEST', message);
    }
}
