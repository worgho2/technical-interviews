import { HttpException, Inject, Injectable } from '@nestjs/common';
import { validateInput } from 'src/application/decorators/validate-input';
import z from 'zod';
import { UserRepository } from 'src/application/user-repository';
import { User } from 'src/domain/entities/user';

const getUserInputSchema = z.object({
  id: z.string().min(1),
});

export type GetUserInput = z.infer<typeof getUserInputSchema>;

export type GetUserOutput = User;

@Injectable()
export class GetUser {
  constructor(@Inject(UserRepository) private readonly userRepository: UserRepository) {}

  @validateInput(getUserInputSchema)
  async execute(input: GetUserInput): Promise<GetUserOutput> {
    const user = await this.userRepository.findById(input.id);
    if (!user) throw new HttpException(`User (${input.id}) not found`, 404);
    return user;
  }
}
