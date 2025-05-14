import z from 'zod';
import { Entity } from './entity';
import { ObjectId } from 'bson';
import { HttpException } from '@nestjs/common';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const userDataSchema = z.object({
  id: z.string().default(new ObjectId().toHexString()),
  name: z.string(),
  email: z.string().email(),
  profilePictureUrl: z.string().nullable(),
  createdAt: z.date().default(dayjs().utc().toDate()),
  updatedAt: z.date().default(dayjs().utc().toDate()),
  deletedAt: z.date().nullable().default(null),
});

export type UserData = z.infer<typeof userDataSchema>;

export class User extends Entity<typeof userDataSchema> {
  constructor(data: UserData) {
    super(data);
  }

  static readonly create = (
    createData: Omit<z.input<typeof userDataSchema>, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ) => {
    const { success, data, error } = userDataSchema.safeParse(createData);

    if (!success) {
      const message = error.errors.map((error) => error.message).join(', ');
      throw new HttpException(message, 400);
    }

    return new User(data);
  };

  static readonly restore = (data: UserData) => {
    return new User(userDataSchema.parse(data));
  };

  onDelete = () => {
    const date = dayjs.utc().toDate();
    this.set('deletedAt', date);
    this.set('updatedAt', date);
    return this;
  };

  updateName = (name?: string) => {
    if (!name) return this;

    const date = dayjs.utc().toDate();
    this.set('name', name);
    this.set('updatedAt', date);
    return this;
  };

  updateProfilePictureUrl = (profilePictureUrl?: string | null) => {
    if (profilePictureUrl === undefined) return this;

    const date = dayjs.utc().toDate();
    this.set('profilePictureUrl', profilePictureUrl);
    this.set('updatedAt', date);
    return this;
  };
}
