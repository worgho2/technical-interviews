import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { GetPokemon } from 'src/application/use-cases/pokemon/get-pokemon';
import { ListPokemons } from 'src/application/use-cases/pokemon/list-pokemons';

/**
 * @note This is not the best way to add typings to models, but since my entities
 * structure does not accept method decorators I'm doing this way
 */
const pokemonApiSchema: SchemaObject = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    height: { type: 'number' },
    weight: { type: 'number' },
    imageUrl: { type: 'string' },
    stats: {
      type: 'object',
      properties: {
        hp: { type: 'number' },
        attack: { type: 'number' },
        defense: { type: 'number' },
        specialAttack: { type: 'number' },
        specialDefense: { type: 'number' },
        speed: { type: 'number' },
      },
    },
  },
};

@ApiTags('Pokemons')
@Controller('api/v0/pokemons')
export class PokemonController {
  constructor(
    private readonly getPokemon: GetPokemon,
    private readonly listPokemons: ListPokemons
  ) {}

  @ApiNotFoundResponse({ description: 'Pokemon not found' })
  @ApiOkResponse({ description: 'Pokemon found', schema: pokemonApiSchema })
  @Get(':id')
  async getPokemonHandler(@Param('id') id: string) {
    const output = await this.getPokemon.execute({ id });
    return output;
  }

  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiOkResponse({
    description: 'Success response',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number' },
        offset: { type: 'number', nullable: true },
        data: {
          type: 'array',
          items: pokemonApiSchema,
        },
      },
    },
  })
  @ApiQuery({ name: 'offset', required: false, type: Number, minimum: 0 })
  @ApiQuery({ name: 'limit', required: false, type: Number, minimum: 1, maximum: 15 })
  @Get()
  async listPokemonsHandler(@Query('limit') limit: number, @Query('offset') offset: number) {
    const output = await this.listPokemons.execute({ limit, offset });
    return output;
  }
}
