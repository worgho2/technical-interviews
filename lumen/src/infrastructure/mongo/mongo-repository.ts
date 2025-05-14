import { ObjectId } from 'mongodb';

type ParseObjectIdResponse<T> = T extends string
  ? ObjectId
  : T extends null
    ? null
    : T extends undefined
      ? undefined
      : never;

export abstract class MongoRepository {
  static readonly parseObjectId = <T extends string | null | undefined>(
    id: T
  ): ParseObjectIdResponse<T> => {
    if (id === null) return null as ParseObjectIdResponse<T>;
    if (id === undefined) return undefined as ParseObjectIdResponse<T>;
    return new ObjectId(id) as ParseObjectIdResponse<T>;
  };
}
