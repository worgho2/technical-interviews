export type PokemonStats = {
    hp: number;
    attack: number;
    defense: number;
    'special-attack': number;
    'special-defense': number;
    speed: number;
};

export type Pokemon = {
    id: number;
    name: string;
    height: number;
    weight: number;
    stats: PokemonStats;
    imageUrl: string | null;
};
