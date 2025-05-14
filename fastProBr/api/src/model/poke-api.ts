export type PokeApiPaginated<T> = {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
};

export type PokeApiNamedResource = {
    name: string;
    url: string;
};

export type PokeApiPokemon = {
    id: number;
    name: string;
    height: number;
    weight: number;
    stats: {
        base_stat: number;
        stat: {
            name: 'hp' | 'attack' | 'defense' | 'special-attack' | 'special-defense' | 'speed';
        };
    }[];
    sprites: {
        front_default: string | null;
    };
};
