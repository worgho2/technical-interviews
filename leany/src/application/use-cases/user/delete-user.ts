import { HttpException, Inject, Injectable } from '@nestjs/common';
import { validateInput } from 'src/application/decorators/validate-input';
import z from 'zod';
import { UserRepository } from 'src/application/user-repository';

const deleteUserInputSchema = z.object({
  id: z.string().min(1),
});

export type DeleteUserInput = z.infer<typeof deleteUserInputSchema>;

@Injectable()
export class DeleteUser {
  constructor(@Inject(UserRepository) private readonly userRepository: UserRepository) {}

  @validateInput(deleteUserInputSchema)
  async execute(input: DeleteUserInput): Promise<void> {
    const user = await this.userRepository.findById(input.id);
    if (!user) throw new HttpException(`User (${input.id}) not found`, 404);
    if (user.get('deletedAt')) throw new HttpException(`User (${input.id}) already deleted`, 400);
    user.onDelete();
    await this.userRepository.update(user);
  }
}
