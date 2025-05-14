import { Address } from 'src/domain/entities/address';

export type CepFindErrorReason = 'INVALID_FORMAT' | 'NOT_FOUND' | 'SERVICE_UNAVAILABLE';

export type CepApiFindResponse =
  | { success: true; data: Address }
  | { success: false; error: CepFindErrorReason };

export interface CepApi {
  find(cep: string): Promise<CepApiFindResponse>;
}

export const CepApi = Symbol('CepApi');
