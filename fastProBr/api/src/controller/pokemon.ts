import { Request } from 'express';
import { BaseHttpController, httpGet, controller, request } from 'inversify-express-utils';
import { CORE, SERVICE } from '../types';
import Joi from 'joi';
import { getValidated } from '../utils/data-validation';
import { inject } from 'inversify';
import { IPokemonService } from '../service/pokemon';

@controller('/pokemons')
export class PokemonController extends BaseHttpController {
    constructor(@inject(SERVICE.pokemon) private pokemonService: IPokemonService) {
        super();
    }

    @httpGet('/', CORE.MIDDLEWARE.authenticated)
    async listPokemons(@request() req: Request) {
        type QueryPayload = {
            offset?: number;
            limit: number;
        };

        const queryPayloadSchema = Joi.object<QueryPayload>({
            offset: Joi.number().integer().min(0).optional(),
            limit: Joi.number().integer().min(1).max(100).required(),
        }).required();

        const query = await getValidated<QueryPayload>(queryPayloadSchema, req.query, {
            abortEarly: true,
            stripUnknown: true,
        });

        const pokemons = await this.pokemonService.listPokemons({
            offset: query.offset,
            limit: query.limit,
        });

        return this.json(pokemons, 200);
    }
}
