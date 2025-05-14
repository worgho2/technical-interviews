import { Container } from 'inversify';
import { Config, IConfig } from './core/config';
import { CORE, DATA, INFRASTRUCTURE, INTEGRATION, SERVICE } from './types';
import { IUserService, UserService } from './service/user';
import { IAuthService } from './model/auth-service';
import { JwtAuthService } from './service/jwt-auth';
import { PrismaClient } from '@prisma/client';
import { IUserData, UserData } from './data/user';
import { BaseMiddleware } from 'inversify-express-utils';
import { AuthenticatedMiddleware } from './core/middlewares/authenticated';
import { IPokemonService, PokemonService } from './service/pokemon';
import { IPokeApiIntegration, PokeApiIntegration } from './integration/poke-api';
import { ILogger, Logger } from './core/logger';
import { LoggerMiddleware } from './core/middlewares/logger';

/**
 * CONTROLLERS
 */
import './controller/auth';
import './controller/user';
import './controller/pokemon';

const container = new Container();
const config = new Config();
config.validate();

/**
 * CORE bindings
 */
container.bind<BaseMiddleware>(CORE.MIDDLEWARE.authenticated).to(AuthenticatedMiddleware).inSingletonScope();
container.bind<LoggerMiddleware>(CORE.MIDDLEWARE.logger).to(LoggerMiddleware).inSingletonScope();
container.bind<IConfig>(CORE.config).toConstantValue(config);
container.bind<ILogger>(CORE.logger).to(Logger).inSingletonScope();

/**
 * INFRASTRUCTURE bindings
 */
container.bind<PrismaClient>(INFRASTRUCTURE.prismaClient).toConstantValue(new PrismaClient());

/**
 * SERVICE bindings
 */
container.bind<IAuthService>(SERVICE.auth).to(JwtAuthService).inSingletonScope();
container.bind<IPokemonService>(SERVICE.pokemon).to(PokemonService).inSingletonScope();
container.bind<IUserService>(SERVICE.user).to(UserService).inSingletonScope();

/**
 * DATA bindings
 */
container.bind<IUserData>(DATA.user).to(UserData).inSingletonScope();

/**
 * INTEGRATION bindings
 */
container.bind<IPokeApiIntegration>(INTEGRATION.pokeApi).to(PokeApiIntegration).inSingletonScope();

export { container };
