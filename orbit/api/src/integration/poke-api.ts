import { inject, injectable } from 'inversify';
import { CORE } from '../types';
import { IConfig } from '../core/config';
import axios, { AxiosInstance } from 'axios';
import { PokeApiNamedResource, PokeApiPaginated, PokeApiPokemon } from '../model/poke-api';
import { ApiError } from '../model/api-error';
import { ILogger } from '../core/logger';

export interface IPokeApiIntegration {
    extractIdFromResourceUrl(url: string): string;
    extractOffsetFromResourceUrl(url: string): number;
    listPokemons(params: { offset?: number; limit: number }): Promise<PokeApiPaginated<PokeApiNamedResource>>;
    getPokemonById(id: string): Promise<PokeApiPokemon>;
    getPokemonByResourceUrl(url: string): Promise<PokeApiPokemon>;
}

@injectable()
export class PokeApiIntegration implements IPokeApiIntegration {
    constructor(@inject(CORE.config) private config: IConfig, @inject(CORE.logger) private logger: ILogger) {}

    private get client(): AxiosInstance {
        let url = this.config.env.POKE_API_URL;

        if (!url.endsWith('/')) {
            url += '/';
        }

        const baseURL = new URL(url).href;
        return axios.create({ baseURL: baseURL });
    }

    private cache: { [key: string]: PokeApiPokemon } = {};

    extractIdFromResourceUrl(url: string): string {
        let path = new URL(url).pathname;

        if (path.endsWith('/')) {
            path = path.slice(0, -1);
        }

        const id = path.split('/').pop();

        if (id === undefined) {
            throw new ApiError('500_INTERNAL_SERVER_ERROR', `Could not extract id from resource url: ${url}`);
        }

        return id;
    }

    extractOffsetFromResourceUrl(url: string): number {
        const params = new URL(url).searchParams;
        const offset = params.get('offset');

        if (offset === null) {
            return 0;
        }

        const offsetAsNumber = parseInt(offset);

        if (isNaN(offsetAsNumber)) {
            return 0;
        }

        return offsetAsNumber;
    }

    async listPokemons(params: { offset?: number; limit: number }): Promise<PokeApiPaginated<PokeApiNamedResource>> {
        const resources = await this.client.get<PokeApiPaginated<PokeApiNamedResource>>(`pokemon`, { params });
        return resources.data;
    }

    async getPokemonById(id: string): Promise<PokeApiPokemon> {
        if (this.cache[id] !== undefined) {
            this.logger.debug(`Pokemon ${id} found in cache`);
            return this.cache[id];
        }

        const pokemon = await this.client.get<PokeApiPokemon>(`pokemon/${id}`);

        const optimizedPokemonData: PokeApiPokemon = {
            id: pokemon.data.id,
            name: pokemon.data.name,
            height: pokemon.data.height,
            weight: pokemon.data.weight,
            sprites: {
                front_default: pokemon.data.sprites.front_default,
            },
            stats: pokemon.data.stats.map((stat) => ({
                base_stat: stat.base_stat,
                stat: {
                    name: stat.stat.name,
                },
            })),
        };

        this.cache[id] = optimizedPokemonData;

        return optimizedPokemonData;
    }

    async getPokemonByResourceUrl(url: string): Promise<PokeApiPokemon> {
        const id = this.extractIdFromResourceUrl(url);
        return this.getPokemonById(id);
    }
}
