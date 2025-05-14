import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CepApi, CepFindErrorReason } from 'src/application/cep-api';
import { Address } from 'src/domain/entities/address';
import { validateInput } from 'src/application/decorators/validate-input';
import z from 'zod';

const getCepInputSchema = z.object({
  cep: z.string().min(8).max(9),
});

export type GetCepInput = z.infer<typeof getCepInputSchema>;

export type GetCepOutput = Address;

@Injectable()
export class GetCep {
  constructor(@Inject(CepApi) private readonly cepApi: CepApi) {}

  @validateInput(getCepInputSchema)
  async execute(input: GetCepInput): Promise<GetCepOutput> {
    const output = await this.cepApi.find(input.cep);

    if (!output.success) {
      const outputErrorReasonMapper: Record<CepFindErrorReason, Error> = {
        NOT_FOUND: new HttpException(`CEP (${input.cep}) was not found`, 404),
        INVALID_FORMAT: new HttpException(`(${input.cep}) is not a valid cep`, 400),
        SERVICE_UNAVAILABLE: new HttpException('Internal Server Error', 500),
      };

      throw outputErrorReasonMapper[output.error];
    }

    return output.data;
  }
}
