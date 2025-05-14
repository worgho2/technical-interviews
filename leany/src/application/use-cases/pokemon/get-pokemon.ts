import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PokemonApi } from 'src/application/pokemon-api';
import { validateInput } from 'src/application/decorators/validate-input';
import { Pokemon } from 'src/domain/entities/pokemon';
import z from 'zod';

const getPokemonInputSchema = z.object({
  id: z.string().min(1),
});

export type GetPokemonInput = z.infer<typeof getPokemonInputSchema>;

export type GetPokemonOutput = Pokemon;

@Injectable()
export class GetPokemon {
  constructor(@Inject(PokemonApi) private readonly pokemonApi: PokemonApi) {}

  @validateInput(getPokemonInputSchema)
  async execute(input: GetPokemonInput): Promise<GetPokemonOutput> {
    const pokemon = await this.pokemonApi.findPokemonById(input.id);
    if (!pokemon) throw new HttpException(`Pokemon (${input.id}) was not found`, 404);
    return pokemon;
  }
}
