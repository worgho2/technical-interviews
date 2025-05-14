import { Module } from '@nestjs/common';
import { CepController } from './interface/cep-controller';
import { ViacepCepApi } from 'src/infrastructure/cep-api/viacep-cep-info-service';
import { RedisCacheService } from 'src/infrastructure/cache-service/redis-cache-service';
import { redisClientFactory } from './infrastructure/redis/redis-client-factory';
import { CacheService } from 'src/application/cache-service';
import { CepApi } from './application/cep-api';
import { GetCep } from './application/use-cases/cep/get-cep';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { PokemonController } from './interface/pokemon-controller';
import { PokemonApi } from './application/pokemon-api';
import { PokePokemonApi } from './infrastructure/pokemon-api/poke-pokemon-api';
import { GetPokemon } from './application/use-cases/pokemon/get-pokemon';
import { ListPokemons } from './application/use-cases/pokemon/list-pokemons';
import { mongoClientFactory } from './infrastructure/mongo/mongo-client-factory';
import { CreateUser } from './application/use-cases/user/create-user';
import { DeleteUser } from './application/use-cases/user/delete-user';
import { GetUser } from './application/use-cases/user/get-user';
import { ListUsers } from './application/use-cases/user/list-users';
import { UpdateUser } from './application/use-cases/user/update-user';
import { UserRepository } from './application/user-repository';
import { MongoUserRepository } from './infrastructure/user-repository/mongo-user-repository';
import { UserController } from './interface/user-controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
  ],
  controllers: [CepController, PokemonController, UserController],
  providers: [
    // Factory Providers
    redisClientFactory,
    mongoClientFactory,

    // Outbound Adapters
    { provide: CacheService, useClass: RedisCacheService },
    { provide: CepApi, useClass: ViacepCepApi },
    { provide: PokemonApi, useClass: PokePokemonApi },
    { provide: UserRepository, useClass: MongoUserRepository },

    // Cep Use Cases
    GetCep,

    // Pokemon Use Cases
    GetPokemon,

    // User Use Cases
    ListPokemons,
    CreateUser,
    DeleteUser,
    GetUser,
    ListUsers,
    UpdateUser,
  ],
})
export class MainModule {}
