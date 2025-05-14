/**
 * Paginated result
 */
export type FPBRAPIPaginatedResult<T> = {
    count: number;
    data: T[];
    offset: number | null;
};

/**
 * User
 */
export type FPBRAPIUser = {
    id: string;
    name: string;
    email: string;
    phone: string;
};

/**
 * Pokemon
 */
export type FPBRAPIPokemon = {
    id: number;
    name: string;
    height: number;
    weight: number;
    imageUrl: string | null;
    stats: {
        hp: number;
        attack: number;
        defense: number;
        'special-attack': number;
        'special-defense': number;
        speed: number;
    };
};

/**
 * Sign in
 */
export type FPBRAPISignInRequestData = {
    email: string;
    hashedPassword: string;
};

export type FPBRAPISignInResponse = {
    id: string;
    token: string;
};

/**
 * Sign up
 */
export type FPBRAPISignUpRequestData = {
    name: string;
    email: string;
    hashedPassword: string;
    phone: string;
};

export type FPBRAPISignUpResponse = FPBRAPIUser;

/**
 * Get user
 */
export type FPBRAPIGetUserResponse = FPBRAPIUser;

/**
 * List pokemons
 */
export type FPBRAPIListPokemonsRequestData = {
    limit: number;
    offset?: number;
};

export type FPBRAPIListPokemonsResponse = FPBRAPIPaginatedResult<FPBRAPIPokemon>;

export class FPBRAPIError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'FPBRAPIError';
    }
}
