import z from 'zod';
import { Entity } from './entity';

export const pokemonDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  height: z.number(),
  weight: z.number(),
  imageUrl: z.string().nullable(),
  stats: z.object({
    hp: z.number(),
    attack: z.number(),
    defense: z.number(),
    specialAttack: z.number(),
    specialDefense: z.number(),
    speed: z.number(),
  }),
});

export type PokemonData = z.infer<typeof pokemonDataSchema>;

export class Pokemon extends Entity<typeof pokemonDataSchema> {
  constructor(data: PokemonData) {
    super(data);
  }

  static readonly with = (data: PokemonData) => {
    return new Pokemon(pokemonDataSchema.parse(data));
  };
}
