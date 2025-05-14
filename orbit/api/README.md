# Orbit API

REST API of the Orbit full-stack test. See the [project README](../README.md) for the challenge description and how the API and the client fit together.

## Endpoints

| Method and path | Auth | Description |
| --- | --- | --- |
| `POST /auth/signup` | none | Create a user and return a JWT |
| `POST /auth/signin` | none | Authenticate and return a JWT |
| `GET /users/:userId` | bearer JWT | Profile of the authenticated user (password hash never leaves the data layer) |
| `GET /pokemons` | bearer JWT | Paginated Pokémon list proxied from PokeAPI |

## Documentation

- [Diagrams](./docs/diagrams.md) (entity relationship, class and use case diagrams)
- [Environment setup](./docs/env-setup.md)
- [CI/CD](./docs/ci-cd.md)

## Quick start

```shell
npm i
cp .env.example .env   # fill PORT, JWT_SECRET, DATABASE_URL, POKE_API_URL
npx prisma migrate dev
npm run dev
npm test
```
