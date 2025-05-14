import { Pokemon } from 'src/domain/entities/pokemon';

export interface PokemonApiListPokemonsInput {
  limit: number;
  offset?: number;
}

export interface PokemonApiListPokemonsOutput {
  count: number;
  offset: number | null;
  data: Pokemon[];
}

export interface PokemonApi {
  findPokemonById(id: string): Promise<Pokemon | undefined>;
  listPokemons(input: PokemonApiListPokemonsInput): Promise<PokemonApiListPokemonsOutput>;
}

export const PokemonApi = Symbol('PokemonApi');
