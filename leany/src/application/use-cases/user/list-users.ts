/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
import { Inject, Injectable } from '@nestjs/common';
import { validateInput } from 'src/application/decorators/validate-input';
import z from 'zod';
import { UserRepository } from 'src/application/user-repository';
import { Paginated } from 'src/domain/dtos/paginated';
import { User } from 'src/domain/entities/user';

const listUsersInputSchema = z.object({});

export type ListUsersInput = z.infer<typeof listUsersInputSchema>;

export type ListUsersOutput = Paginated<User>;

@Injectable()
export class ListUsers {
  constructor(@Inject(UserRepository) private readonly userRepository: UserRepository) {}

  @validateInput(listUsersInputSchema)
  async execute(input: ListUsersInput): Promise<ListUsersOutput> {
    throw new Error('Method not implemented due short deadline');
  }
}
