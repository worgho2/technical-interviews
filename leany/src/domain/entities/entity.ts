/* eslint-disable @typescript-eslint/no-unsafe-return */
import { z, ZodType } from 'zod';

export abstract class Entity<T extends ZodType<any, any, any>> {
  protected constructor(protected data: z.infer<T>) {}

  public get = <K extends keyof z.infer<T>>(key: K): z.infer<T>[K] => {
    return this.data[key];
  };

  protected set = <K extends keyof z.infer<T>>(key: K, value: z.infer<T>[K]) => {
    this.data[key] = value;
    return this;
  };

  public toJSON = (): z.infer<T> => {
    return this.data;
  };
}
