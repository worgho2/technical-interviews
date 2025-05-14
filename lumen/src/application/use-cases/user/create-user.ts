import { Inject, Injectable } from '@nestjs/common';
import { validateInput } from 'src/application/decorators/validate-input';
import z from 'zod';
import { UserRepository } from 'src/application/user-repository';
import { User } from 'src/domain/entities/user';

const createUserInputSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  profilePictureUrl: z.string().url().nullable(),
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export type CreateUserOutput = User;

@Injectable()
export class CreateUser {
  constructor(@Inject(UserRepository) private readonly userRepository: UserRepository) {}

  @validateInput(createUserInputSchema)
  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    const user = User.create({
      name: input.name,
      email: input.email,
      profilePictureUrl: input.profilePictureUrl,
    });
    await this.userRepository.save(user);
    return user;
  }
}
