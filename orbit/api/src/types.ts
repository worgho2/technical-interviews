export const CORE = {
    MIDDLEWARE: {
        authenticated: Symbol('authenticated'),
        logger: Symbol('logger'),
    },
    config: Symbol('config'),
    logger: Symbol('logger'),
};

export const INFRASTRUCTURE = {
    prismaClient: Symbol('prismaClient'),
};

export const SERVICE = {
    auth: Symbol('auth'),
    pokemon: Symbol('pokemon'),
    user: Symbol('user'),
};

export const DATA = {
    user: Symbol('user'),
};

export const INTEGRATION = {
    pokeApi: Symbol('pokeApi'),
};
