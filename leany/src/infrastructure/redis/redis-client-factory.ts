import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const redisClientFactory: FactoryProvider = {
  provide: Redis,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return new Redis({
      host: configService.get<string>('redis.host'),
      port: configService.get<number>('redis.port'),
      password: configService.get<string | undefined>('redis.password'),
      username: configService.get<string | undefined>('redis.username'),
    });
  },
};
