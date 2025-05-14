import { Inject, Injectable } from '@nestjs/common';
import { PokemonApi } from 'src/application/pokemon-api';
import { validateInput } from 'src/application/decorators/validate-input';
import { Pokemon } from 'src/domain/entities/pokemon';
import z from 'zod';

const listPokemonsInputSchema = z.object({
  limit: z.number({ coerce: true }).int().min(1).max(15).default(10),
  offset: z.number({ coerce: true }).int().min(1).optional(),
});

export type ListPokemonsInput = z.infer<typeof listPokemonsInputSchema>;

export type ListPokemonsOutput = {
  count: number;
  offset: number | null;
  data: Pokemon[];
};

@Injectable()
export class ListPokemons {
  constructor(@Inject(PokemonApi) private readonly pokemonApi: PokemonApi) {}

  @validateInput(listPokemonsInputSchema)
  async execute(input: ListPokemonsInput): Promise<ListPokemonsOutput> {
    const paginatedPokemonList = await this.pokemonApi.listPokemons({
      limit: input.limit,
      offset: input.offset,
    });

    return paginatedPokemonList;
  }
}
