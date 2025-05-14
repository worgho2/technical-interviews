import { HttpException, Inject, Injectable } from '@nestjs/common';
import { validateInput } from 'src/application/decorators/validate-input';
import z from 'zod';
import { UserRepository } from 'src/application/user-repository';
import { User } from 'src/domain/entities/user';

const updateUserInputSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).optional(),
  profilePictureUrl: z.string().url().nullish(),
});

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

export type UpdateUserOutput = User;

@Injectable()
export class UpdateUser {
  constructor(@Inject(UserRepository) private readonly userRepository: UserRepository) {}

  @validateInput(updateUserInputSchema)
  async execute(input: UpdateUserInput): Promise<UpdateUserOutput> {
    const user = await this.userRepository.findById(input.id);
    if (!user) throw new HttpException(`User (${input.id}) not found`, 404);
    user.updateName(input.name).updateProfilePictureUrl(input.profilePictureUrl);
    await this.userRepository.update(user);
    return user;
  }
}
