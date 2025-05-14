import { ObjectId } from 'bson';

export interface UserDbModel {
  _id: ObjectId;
  name: string;
  email: string;
  profilePictureUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
