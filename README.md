# Technical Interviews

A collection of take-home technical challenges I completed during hiring processes, kept here as a portfolio of how I approach real-world engineering tasks: reading a spec, choosing an architecture, writing tests, documenting the result and, when it made sense, shipping it to the cloud.

> **About the company names**
>
> The companies that authored these challenges are not named anywhere in this repository. Every project folder, package name and reference uses a **fictional name** (Northwind, Lumen, Trustline, Orbit) chosen only to keep the projects apart. Any resemblance to a real company is coincidental. The challenge statements themselves are reproduced or summarized so the context of each solution is clear.

## Projects

| Folder | Fictional company | Stack | Type of challenge |
| --- | --- | --- | --- |
| [`northwind/`](northwind/) | Northwind | TypeScript, SQLite | Coding exercises (typing, SQL, refactoring) |
| [`lumen/`](lumen/) | Lumen | NestJS, MongoDB, Redis, Docker | Backend CRUD API with external integrations |
| [`trustline/`](trustline/) | Trustline | Java, Micronaut, MongoDB, SST on AWS | REST API from an OpenAPI spec, deployed to the cloud |
| [`orbit/`](orbit/) | Orbit | Express, Prisma, PostgreSQL, Next.js | Full-stack app with authentication |

### Northwind: TypeScript and SQL exercises

A set of twelve short, self-contained exercises split in three blocks. The first block tests TypeScript fundamentals such as generics, union types and immutability. The second block is pure SQL: six analytical queries (revenue per product, duplicated emails, customer totals, category rankings, monthly summaries) that had to run against given table definitions, which I solved by executing every query against a throw-away in-memory SQLite database. The third block hands over intentionally messy functions and asks for a Clean Code refactor with better names, less nesting and smaller units.

### Lumen: NestJS CRUD API with external integrations

Build a complete CRUD API with NestJS following an MVC or layered architecture, with strict separation between database entities and the DTOs that travel through the API, validation of every input attribute, permission checks in middlewares or decorators, a local database started with Docker, and Swagger documentation. On top of the CRUD, the API had to expose two integrations: a Brazilian postal-code (CEP) lookup available as an internal service, and a paginated, filterable search over the public PokeAPI. I solved it with a hexagonal architecture on top of MongoDB and added a Redis cache in front of the external APIs.

### Trustline: Consents API from an OpenAPI specification

Given an OpenAPI file describing a Consents API (create a consent that starts as `AWAITING_AUTHORISATION`, read it, update its status to `AUTHORISED`, revoke it by deleting it) implement it in Java with Micronaut or Spring Boot without modifying the spec, with proper REST semantics and status codes. Security best practices and automated tests were optional extras. I implemented it in Micronaut with a Domain Driven Design and Ports and Adapters layout, reactive MongoDB access, unit and integration tests, a GraalVM native image, GitHub Actions CI and release automation, and an SST infrastructure-as-code definition that deploys it to AWS ECS Fargate behind either an API Gateway or an Application Load Balancer.

### Orbit: full-stack Pokémon browser with authentication

A full-stack developer test split in two deliverables: a REST API and a web client. The API (Express, Prisma, PostgreSQL) needed user sign-up and sign-in with JWT, a protected user profile route and a protected, paginated Pokémon listing that proxies the public PokeAPI. The client (Next.js, Material UI, NextAuth) needed a sign-up and sign-in flow and an authenticated page rendering the Pokémon list as cards. Both parts have CI and release pipelines and were originally deployed to Heroku.

## Conventions

- Each folder is an independent project with its own README, dependencies and setup instructions.
- Package names, environment variables and code identifiers were renamed to the fictional names above. Changelog links that pointed to the original private repositories were renamed the same way and are therefore not expected to resolve.
- The code is presented as it was submitted, apart from the anonymization described here.
