import { HttpException } from '@nestjs/common';
import { type z } from 'zod';

type UseCaseMethod = (input: unknown) => Promise<unknown>;

/**
 * This method decorator is used to validate the input against a zod schema. It accepts a zod schema
 * and validates the input against it.
 */
export const validateInput =
  (schema: z.Schema) => (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value as UseCaseMethod;

    function decoreatedMethod(this: unknown, input: unknown) {
      const inputValidation = schema.safeParse(input);
      if (!inputValidation.success) {
        const message = inputValidation.error.errors.map((error) => error.message).join(', ');
        throw new HttpException(message, 400, { cause: inputValidation.error });
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return originalMethod.apply(this, [inputValidation.data]);
    }

    descriptor.value = decoreatedMethod;

    return descriptor;
  };
