/**
 * Paginated result
 */
export type OrbitAPIPaginatedResult<T> = {
    count: number;
    data: T[];
    offset: number | null;
};

/**
 * User
 */
export type OrbitAPIUser = {
    id: string;
    name: string;
    email: string;
    phone: string;
};

/**
 * Pokemon
 */
export type OrbitAPIPokemon = {
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
export type OrbitAPISignInRequestData = {
    email: string;
    hashedPassword: string;
};

export type OrbitAPISignInResponse = {
    id: string;
    token: string;
};

/**
 * Sign up
 */
export type OrbitAPISignUpRequestData = {
    name: string;
    email: string;
    hashedPassword: string;
    phone: string;
};

export type OrbitAPISignUpResponse = OrbitAPIUser;

/**
 * Get user
 */
export type OrbitAPIGetUserResponse = OrbitAPIUser;

/**
 * List pokemons
 */
export type OrbitAPIListPokemonsRequestData = {
    limit: number;
    offset?: number;
};

export type OrbitAPIListPokemonsResponse = OrbitAPIPaginatedResult<OrbitAPIPokemon>;

export class OrbitAPIError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'OrbitAPIError';
    }
}
