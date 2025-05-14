# Orbit client

Web client of the Orbit full-stack test, built with Next.js 13, Material UI and NextAuth. See the [project README](../README.md) for the challenge description and how the client talks to the API.

## Requirements

- Node.js 16 (`.nvmrc` is provided)
- The [Orbit API](../api/) running locally

## Setup

```shell
npm i
cp .env.local.example .env.local   # fill NEXTAUTH_URL and NEXTAUTH_SECRET
npm run dev
```

`.env.development` points the client at `http://localhost:3001/`, the API's default local address. Change `NEXT_PUBLIC_ORBIT_API_ENDPOINT` if the API runs elsewhere.

## What is inside

- `pages/index.tsx`: shows the sign-up form to anonymous visitors and the Pokémon list to authenticated users.
- `pages/api/auth/[...nextauth].ts`: credentials provider that signs in against the API and keeps the JWT in the session.
- `services/orbit-api.ts` and `models/orbit-api.ts`: typed wrapper around the API.
- `hooks/pokemon-provider.tsx`: paginated fetching and error handling for the list.
- `components/`: app bar, menu, sign-up form, Pokémon cards, loader and a retry helper.
