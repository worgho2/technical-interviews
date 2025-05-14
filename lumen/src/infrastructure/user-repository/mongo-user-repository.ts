import { Filter, MongoClient, ObjectId } from 'mongodb';
import { UserRepository } from 'src/application/user-repository';
import { User } from 'src/domain/entities/user';
import { MongoRepository } from '../mongo/mongo-repository';
import { Inject } from '@nestjs/common';
import { UserDbModel } from '../mongo/models/user-db-model';
import { Paginated } from 'src/domain/dtos/paginated';

export class MongoUserRepository extends MongoRepository implements UserRepository {
  constructor(@Inject(MongoClient) private readonly mongoClient: MongoClient) {
    super();
  }

  static readonly mapDbModelToEntity = (dbModel: UserDbModel): User => {
    return User.restore({
      id: dbModel._id.toHexString(),
      name: dbModel.name,
      email: dbModel.email,
      profilePictureUrl: dbModel.profilePictureUrl ?? null,
      createdAt: dbModel.createdAt,
      updatedAt: dbModel.updatedAt,
      deletedAt: dbModel.deletedAt ?? null,
    });
  };

  static readonly mapEntityToDbModel = (entity: User): UserDbModel => {
    return {
      _id: this.parseObjectId(entity.get('id')),
      name: entity.get('name'),
      email: entity.get('email'),
      profilePictureUrl: entity.get('profilePictureUrl'),
      createdAt: entity.get('createdAt'),
      updatedAt: entity.get('updatedAt'),
      deletedAt: entity.get('deletedAt'),
    };
  };

  private get collection() {
    return this.mongoClient.db().collection<UserDbModel>('users');
  }

  save = async (user: User): Promise<void> => {
    const document = MongoUserRepository.mapEntityToDbModel(user);
    await this.collection.insertOne(document, { ignoreUndefined: true });
  };

  findById = async (id: string): Promise<User | undefined> => {
    if (!ObjectId.isValid(id)) return undefined;
    const filter: Filter<UserDbModel> = { _id: MongoRepository.parseObjectId(id) };
    const document = await this.collection.findOne(filter);
    if (!document) return undefined;
    return MongoUserRepository.mapDbModelToEntity(document);
  };

  update = async (user: User): Promise<void> => {
    const filter: Filter<UserDbModel> = { _id: MongoRepository.parseObjectId(user.get('id')) };
    const document = MongoUserRepository.mapEntityToDbModel(user);
    await this.collection.replaceOne(filter, document, { ignoreUndefined: true });
  };

  // eslint-disable-next-line @typescript-eslint/require-await
  list = async (): Promise<Paginated<User>> => {
    throw new Error('Method not implemented due short deadline');
  };
}
