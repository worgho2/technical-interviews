import z from 'zod';
import { Entity } from './entity';

export const addressDataSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  neighborhood: z.string().optional(),
  state: z.string().optional(),
});

export type AddressData = z.infer<typeof addressDataSchema>;

export class Address extends Entity<typeof addressDataSchema> {
  constructor(data: AddressData) {
    super(data);
  }

  static readonly with = (data: AddressData) => {
    return new Address(addressDataSchema.parse(data));
  };
}
