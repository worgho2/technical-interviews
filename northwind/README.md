# Northwind: TypeScript and SQL exercises

> The company name is fictional. See the [root README](../README.md) for context.

Twelve short exercises delivered as a single TypeScript project. Each exercise lives in its own folder under `src/` and carries the original statement (in Portuguese) as a comment at the top of the file.

## Exercises

### 1. TypeScript typing

| Exercise | Statement (summary) |
| --- | --- |
| `1.1` | Extract the values of one key from an array of objects, fully typed with generics. |
| `1.2` | A `calculate` function that accepts a union of operation names and throws on unsupported operations or division by zero. |
| `1.3` | Turn every negative number of a list into a positive one without mutating the original array. |

### 2. SQL queries

Each folder contains an `exec.sql` with the table definitions and seed data and a `query.sql` with the answer. The runner creates an in-memory SQLite database, executes `exec.sql` and prints the result of `query.sql`.

| Exercise | Statement (summary) |
| --- | --- |
| `2.1` | Total revenue per product, highest first. |
| `2.2` | Emails registered more than once. |
| `2.3` | Employees listing. |
| `2.4` | Total spent per customer, joining customers and orders. |
| `2.5` | Units sold per product inside the best-selling categories. |
| `2.6` | Accounts whose monthly transaction total crosses a threshold. |

### 3. Refactoring

| Exercise | Statement (summary) |
| --- | --- |
| `3.1` | Refactor an item-processing loop following Clean Code principles. |
| `3.2` | Flatten a nested discount calculation into readable, modular code. |
| `3.3` | Rename and restructure an obscure array-processing function. |

## Requirements

- Node.js 20 (`.nvmrc` is provided)
- pnpm 9

## Running

```shell
pnpm install

# Run one exercise by its number
pnpm dev 1.1
pnpm dev 2.4
```

Other useful scripts:

```shell
pnpm typecheck
pnpm lint
pnpm format:check
```
