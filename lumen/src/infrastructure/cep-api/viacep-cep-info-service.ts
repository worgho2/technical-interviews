import { Inject, Injectable, Logger } from '@nestjs/common';
import { CacheService } from 'src/application/cache-service';
import { CepApi, CepApiFindResponse } from 'src/application/cep-api';
import { Address } from 'src/domain/entities/address';
import { z } from 'zod';

@Injectable()
export class ViacepCepApi implements CepApi {
  constructor(@Inject(CacheService) private readonly cacheService: CacheService) {}

  private readonly logger = new Logger(ViacepCepApi.name, { timestamp: true });

  find = async (rawCep: string): Promise<CepApiFindResponse> => {
    const cep = rawCep.replace(/\D/g, '');

    if (cep.length !== 8) {
      return {
        success: false,
        error: 'INVALID_FORMAT',
      };
    }

    const cachedResponse = await this.getCachedFindResponse(cep);
    if (cachedResponse) {
      this.logger.debug(`Cache hit for cep ${cep}`);
      return cachedResponse;
    }

    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!response.ok) {
      const rawBody = await response.text();
      this.logger.error(`Failed to fetch viacep api`, { rawBody });
      return {
        success: false,
        error: 'SERVICE_UNAVAILABLE',
      };
    }

    const data = z
      .object({
        erro: z.string().optional(),
        logradouro: z.string().optional(),
        bairro: z.string().optional(),
        localidade: z.string().optional(),
        uf: z.string().optional(),
      })
      .parse(await response.json());

    let findReponse: CepApiFindResponse = {
      success: true,
      data: Address.with({
        street: data.logradouro,
        city: data.localidade,
        neighborhood: data.bairro,
        state: data.uf,
      }),
    };

    if (data.erro) {
      findReponse = { success: false, error: 'NOT_FOUND' };
    }

    await this.cacheFindResponse(cep, findReponse);
    return findReponse;
  };

  private getCacheKey = (cep: string) => `viacep-cep-api:${cep}`;

  private getCachedFindResponse = async (cep: string) => {
    const key = this.getCacheKey(cep);
    return this.cacheService.get<CepApiFindResponse>(key);
  };

  private cacheFindResponse = async (cep: string, response: CepApiFindResponse) => {
    const key = this.getCacheKey(cep);
    const ttl = 60 * 60 * 24;
    await this.cacheService.set(key, response, ttl);
  };
}
