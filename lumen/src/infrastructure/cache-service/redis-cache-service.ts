import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { CacheService } from 'src/application/cache-service';

@Injectable()
export class RedisCacheService implements CacheService {
  constructor(@Inject(Redis) private readonly redisClient: Redis) {}

  private readonly logger = new Logger(RedisCacheService.name, { timestamp: true });

  get = async <T>(key: string): Promise<T | undefined> => {
    const rawValue = await this.redisClient.get(key);
    if (!rawValue) return undefined;
    return JSON.parse(rawValue) as T;
  };

  set = async <T>(key: string, value: T, ttl?: number): Promise<void> => {
    const rawValue = JSON.stringify(value);

    this.logger.debug(`Setting cache for key ${key}(ttl? ${ttl ?? 'no'})`, value);

    if (ttl) {
      await this.redisClient.set(key, rawValue, 'EX', ttl);
      return;
    }

    await this.redisClient.set(key, rawValue);
  };

  delete = async (key: string): Promise<void> => {
    await this.redisClient.del(key);
  };
}
