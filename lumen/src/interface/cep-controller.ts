import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetCep } from 'src/application/use-cases/cep/get-cep';

@ApiTags('Cep')
@Controller('api/v0/ceps')
export class CepController {
  constructor(private readonly getCep: GetCep) {}

  @ApiNotFoundResponse({ description: 'Cep not found' })
  @ApiBadRequestResponse({ description: 'Invalid cep' })
  @ApiOkResponse({
    description: 'Cep found',
    schema: {
      type: 'object',
      properties: {
        street: { type: 'string' },
        city: { type: 'string' },
        neighborhood: { type: 'string' },
        state: { type: 'string' },
      },
    },
  })
  @Get(':cep')
  async getCepHandler(@Param('cep') cep: string) {
    const output = await this.getCep.execute({ cep });
    return output;
  }
}
