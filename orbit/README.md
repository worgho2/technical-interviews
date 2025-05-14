# Orbit: full-stack Pokémon browser with authentication

> The company name is fictional. See the [root README](../README.md) for context.

A full-stack developer test delivered as two independent applications that were originally two separate repositories:

| Folder | What it is | Stack |
| --- | --- | --- |
| [`api/`](api/) | REST API with sign-up, sign-in, user profile and a paginated Pokémon listing | Node.js 16, Express, Inversify, Prisma, PostgreSQL, JWT, Jest |
| [`client/`](client/) | Web client with the sign-up and sign-in flow and the Pokémon list | Next.js 13, React 18, Material UI, NextAuth |

## Challenge

The original brief is not stored in this repository, so this is a reconstruction from what was built.

The API had to expose:

- `POST /auth/signup` and `POST /auth/signin` issuing a JWT.
- `GET /users/:userId`, restricted to the authenticated user.
- `GET /pokemons`, authenticated and paginated, with the data fetched from the public [PokeAPI](https://pokeapi.co/) and reduced to the fields the client needs.

The client had to offer a sign-up form, a sign-in form, and, once authenticated, a page listing the Pokémon as cards with their stats.

## How the pieces fit

1. The browser talks only to the Next.js app.
2. NextAuth, running inside Next.js API routes, calls the API sign-in endpoint with a hashed password and stores the returned JWT in the session.
3. Client pages call the API through a small typed service module, sending the JWT as a bearer token.
4. The API validates the token, reads users from PostgreSQL through Prisma and proxies Pokémon data from PokeAPI.

## Running locally

Start the API first, then the client. Each folder has its own instructions:

- API: [`api/docs/env-setup.md`](api/docs/env-setup.md)
- Client: [`client/README.md`](client/README.md)

The client expects the API address in `NEXT_PUBLIC_ORBIT_API_ENDPOINT` (see `client/.env.development`).

## Delivery pipeline

Both applications carry a GitHub Actions setup: a CI workflow that installs, builds, tests and lints on every pull request, and a Release Please workflow that opens release pull requests from conventional commits and deployed each app to Heroku when a release was merged. See [`api/docs/ci-cd.md`](api/docs/ci-cd.md). The Heroku apps are no longer running.
