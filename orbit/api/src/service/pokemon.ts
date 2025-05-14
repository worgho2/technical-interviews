import { inject, injectable } from 'inversify';
import { Pokemon, PokemonStats } from '../model/pokemon';
import { Paginated } from '../model/paginated';
import { INTEGRATION } from '../types';
import { IPokeApiIntegration } from '../integration/poke-api';

export interface IPokemonService {
    listPokemons(params: { offset?: number; limit: number }): Promise<Paginated<Pokemon>>;
}

@injectable()
export class PokemonService implements IPokemonService {
    constructor(@inject(INTEGRATION.pokeApi) private pokeApi: IPokeApiIntegration) {}

    async listPokemons(params: { offset?: number; limit: number }): Promise<Paginated<Pokemon>> {
        const pokemonResources = await this.pokeApi.listPokemons(params);

        const pokemons: Pokemon[] = await Promise.all(
            pokemonResources.results.map(async (pokemonResource) => {
                const apiPokemon = await this.pokeApi.getPokemonByResourceUrl(pokemonResource.url);

                const baseStats: PokemonStats = {
                    hp: 0,
                    attack: 0,
                    defense: 0,
                    'special-attack': 0,
                    'special-defense': 0,
                    speed: 0,
                };

                const stats = apiPokemon.stats.reduce((acc, stat) => {
                    if (stat.stat.name in acc) {
                        return {
                            ...acc,
                            [stat.stat.name]: stat.base_stat,
                        };
                    }

                    return acc;
                }, baseStats);

                return <Pokemon>{
                    id: apiPokemon.id,
                    name: apiPokemon.name,
                    height: apiPokemon.height,
                    weight: apiPokemon.weight,
                    imageUrl: apiPokemon.sprites.front_default,
                    stats,
                };
            }),
        );

        return {
            count: pokemonResources.count,
            offset: pokemonResources.next ? this.pokeApi.extractOffsetFromResourceUrl(pokemonResources.next) : null,
            data: pokemons,
        };
    }
}
