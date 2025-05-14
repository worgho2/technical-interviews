import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { CreateUser, CreateUserInput } from 'src/application/use-cases/user/create-user';
import { DeleteUser } from 'src/application/use-cases/user/delete-user';
import { GetUser } from 'src/application/use-cases/user/get-user';
import { ListUsers } from 'src/application/use-cases/user/list-users';
import { UpdateUser } from 'src/application/use-cases/user/update-user';

/**
 * @note This is not the best way to add typings to models, but since my entities
 * structure does not accept method decorators I'm doing this way
 */
const userApiSchema: SchemaObject = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string' },
    profilePictureUrl: { type: 'string', nullable: true },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    deletedAt: { type: 'string', format: 'date-time', nullable: true },
  },
};

@ApiTags('Users')
@Controller('api/v0/users')
export class UserController {
  constructor(
    private readonly createUser: CreateUser,
    private readonly deleteUser: DeleteUser,
    private readonly getUser: GetUser,
    private readonly listUsers: ListUsers,
    private readonly updateUser: UpdateUser
  ) {}

  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiCreatedResponse({ description: 'User created', schema: userApiSchema })
  @ApiBody({
    type: 'object',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        profilePictureUrl: { type: 'string', nullable: true },
      },
    },
  })
  @Post()
  async createUserHandler(@Body() body: CreateUserInput) {
    const output = await this.createUser.execute(body);
    return output;
  }

  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiNoContentResponse({ description: 'User deleted' })
  @Delete(':id')
  async deleteUserHandler(@Param('id') id: string) {
    await this.deleteUser.execute({ id });
  }

  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiOkResponse({ description: 'User found', schema: userApiSchema })
  @Get(':id')
  async getUserHandler(@Param('id') id: string) {
    const output = await this.getUser.execute({ id });
    return output;
  }

  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiOkResponse({
    description: 'Users found',
    schema: {
      type: 'object',
      properties: {
        pages: { type: 'number' },
        items: { type: 'number' },
        data: {
          type: 'array',
          items: userApiSchema,
        },
      },
    },
  })
  @Get()
  async listUsersHandler() {
    const output = await this.listUsers.execute({});
    return output;
  }

  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiOkResponse({ description: 'User updated', schema: userApiSchema })
  @Patch(':id')
  async updateUserHandler(@Param('id') id: string, @Body() body: CreateUserInput) {
    const output = await this.updateUser.execute({ id, ...body });
    return output;
  }
}
