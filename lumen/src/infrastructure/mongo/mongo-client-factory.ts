import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient } from 'mongodb';

export const mongoClientFactory: FactoryProvider = {
  provide: MongoClient,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return new MongoClient(configService.get<string>('mongo.url')!, {});
  },
};
