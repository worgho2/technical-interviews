import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { CacheService } from 'src/application/cache-service';
import {
  PokemonApi,
  PokemonApiListPokemonsInput,
  PokemonApiListPokemonsOutput,
} from 'src/application/pokemon-api';
import { Pokemon } from 'src/domain/entities/pokemon';
import z from 'zod';

@Injectable()
export class PokePokemonApi implements PokemonApi {
  constructor(@Inject(CacheService) private readonly cacheService: CacheService) {}

  private readonly logger = new Logger(PokePokemonApi.name, { timestamp: true });

  findPokemonById = async (id: string): Promise<Pokemon | undefined> => {
    const cachedPokemon = await this.getCachedPokemon(id);
    if (cachedPokemon) {
      this.logger.debug(`Cache hit for pokemon ${id}`);
      return cachedPokemon;
    }

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    if (!response.ok) {
      if (response.status === 404) return undefined;

      const rawBody = await response.text();
      this.logger.error(`Failed to fetch poke api`, { rawBody });

      return undefined;
    }

    const statNameSchema = z.enum([
      'hp',
      'attack',
      'defense',
      'special-attack',
      'special-defense',
      'speed',
    ]);

    const data = z
      .object({
        id: z.number(),
        name: z.string(),
        height: z.number(),
        weight: z.number(),
        stats: z
          .object({
            base_stat: z.number(),
            stat: z.object({
              name: statNameSchema,
            }),
          })
          .array(),
        sprites: z.object({
          front_default: z.string().nullish(),
        }),
      })
      .parse(await response.json());

    const statNameToValueMap = data.stats.reduce(
      (acc, stat) => ({
        ...acc,
        [stat.stat.name]: stat.base_stat,
      }),
      {} as Record<z.infer<typeof statNameSchema>, number | undefined>
    );

    const pokemon = Pokemon.with({
      id: data.id.toString(),
      name: data.name,
      height: data.height,
      weight: data.weight,
      imageUrl: data.sprites.front_default ?? null,
      stats: {
        hp: statNameToValueMap.hp ?? 0,
        attack: statNameToValueMap.attack ?? 0,
        defense: statNameToValueMap.defense ?? 0,
        specialAttack: statNameToValueMap['special-attack'] ?? 0,
        specialDefense: statNameToValueMap['special-defense'] ?? 0,
        speed: statNameToValueMap.speed ?? 0,
      },
    });

    await this.cachePokemon(id, pokemon);
    return pokemon;
  };

  private getPokemonCacheKey = (id: string) => `poke-pokemon-api:pokemon:${id}`;

  private getCachedPokemon = async (id: string) => {
    const key = this.getPokemonCacheKey(id);
    return this.cacheService.get<Pokemon>(key);
  };

  private cachePokemon = async (id: string, pokemon: Pokemon) => {
    const key = this.getPokemonCacheKey(id);
    const ttl = 60 * 60 * 24;
    await this.cacheService.set(key, pokemon, ttl);
  };

  listPokemons = async (
    input: PokemonApiListPokemonsInput
  ): Promise<PokemonApiListPokemonsOutput> => {
    const cachedResponse = await this.getCachedListPokemonsResponse(input);
    if (cachedResponse) {
      this.logger.debug(
        `Cache hit for pokemon list: (limit:${input.limit}, offset:${input.offset ?? 0}`
      );
      return cachedResponse;
    }

    const url = new URL(`https://pokeapi.co/api/v2/pokemon/`);
    url.searchParams.set('limit', input.limit.toString());
    if (input.offset) url.searchParams.set('offset', input.offset.toString());
    const response = await fetch(url.href);

    if (!response.ok) {
      const rawBody = await response.text();
      throw new HttpException('Internal Server Error', 500, {
        cause: rawBody,
        description: 'Failed to fetch poke api',
      });
    }

    const data = z
      .object({
        count: z.number(),
        next: z.string().nullable(),
        results: z
          .object({
            name: z.string(),
            url: z.string(),
          })
          .array(),
      })
      .parse(await response.json());

    const pokemonList = await Promise.all(
      data.results.map(async (result) => {
        const id = result.url.split('/').at(-2)!;
        const pokemon = (await this.findPokemonById(id)) as Pokemon;
        return pokemon;
      })
    );

    const output: PokemonApiListPokemonsOutput = {
      count: data.count,
      offset: data.next ? Number(new URL(data.next).searchParams.get('offset')) : null,
      data: pokemonList,
    };

    await this.cacheListPokemonsResponse(input, output);
    return output;
  };

  private getCacheKeyForListPokemonsReponse = (input: PokemonApiListPokemonsInput) =>
    `poke-pokemon-api:pokemon-list:${input.offset ?? 0}-${input.limit}`;

  private getCachedListPokemonsResponse = async (input: PokemonApiListPokemonsInput) => {
    const key = this.getCacheKeyForListPokemonsReponse(input);
    return this.cacheService.get<PokemonApiListPokemonsOutput>(key);
  };

  private cacheListPokemonsResponse = async (
    input: PokemonApiListPokemonsInput,
    pokemonList: PokemonApiListPokemonsOutput
  ) => {
    const key = this.getCacheKeyForListPokemonsReponse(input);
    const ttl = 60 * 60 * 24;
    await this.cacheService.set(key, pokemonList, ttl);
  };
}
