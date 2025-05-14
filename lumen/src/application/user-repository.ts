import { Paginated } from 'src/domain/dtos/paginated';
import { User } from 'src/domain/entities/user';

export interface UserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | undefined>;
  update(user: User): Promise<void>;
  list(): Promise<Paginated<User>>;
}

export const UserRepository = Symbol('UserRepository');
