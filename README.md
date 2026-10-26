# GraphQL Examples

A practical GraphQL demo built with React, TypeScript and GraphQL Yoga. Look up users, explore their posts and update their names through a typed GraphQL API.

## Features

- Query users by ID using GraphQL variables.
- Fetch related posts through nested field selections.
- Update names using a mutation and display the returned user without an additional query.
- Handle loading, saving, missing users and API errors.
- Validate names on the server and prevent blank submissions in the UI.
- Test components, schema execution and complete browser journeys.

## Tech stack

| Area | Tools |
| --- | --- |
| Frontend | React, TypeScript, Vite |
| Backend | Node.js, GraphQL Yoga, GraphQL |
| Development | tsx, ESLint, Prettier |
| Component tests | Vitest, React Testing Library, user-event, jsdom |
| Backend tests | Vitest, GraphQL schema execution |
| Browser tests | Playwright with Chromium |

Prettier uses four spaces for indentation and never uses tabs.

## Getting started

Use Node.js 22.12+ or a newer supported LTS release compatible with the installed dependencies, and npm.

From the repository root:

```bash
npm ci
npx playwright install chromium
```

Start the backend:

```bash
npm run dev:server
```

In a second terminal, start the frontend:

```bash
npm run dev
```

- Application: http://localhost:5173
- GraphiQL query editor: http://localhost:4000/graphql

Vite forwards development requests from `/graphql` to the backend on port 4000. Both servers must be running to use the application.

### Sample data

| User ID | Name | Posts |
| --- | --- | --- |
| `1` | Darren | Understanding vocal harmonies; Building my studio website |
| `2` | Sarah | Learning GraphQL |
| `999` | No matching user | Displays the missing-user message |

Data is stored in memory. Name changes survive a browser reload but reset when the backend restarts, including watch-triggered restarts.

## GraphQL examples

In GraphiQL, put the operation in the main query editor and the variables in the Variables panel. Leave Headers as `{}` unless custom headers are needed. Refresh GraphiQL after schema changes if its editor still reports outdated fields.

### Query a user and their posts

```graphql
query GetUser($id: ID!) {
    user(id: $id) {
        id
        name
        email
        posts {
            id
            title
        }
    }
}
```

Variables:

```json
{
    "id": "1"
}
```

The client selects the response fields. `Query.user` finds the user, while `User.posts` resolves the related posts using the user's ID. An unknown user ID returns `user: null`.

The API also exposes a `users` query for listing all users.

### Update a name

```graphql
mutation UpdateUserName($id: ID!, $name: String!) {
    updateUserName(id: $id, name: $name) {
        id
        name
        email
        posts {
            id
            title
        }
    }
}
```

Variables:

```json
{
    "id": "1",
    "name": "Darren Sweeney"
}
```

For an existing user, the resolver trims the name and rejects empty or whitespace-only values. Unknown user IDs return `updateUserName: null`. The frontend uses the mutation response to update its displayed user.

## Project organisation

| Path | Purpose |
| --- | --- |
| `src/App.tsx` | Demo page layout |
| `src/api/users.ts` | GraphQL operations, response types and fetch functions |
| `src/components/UserLookup.tsx` | User lookup and result display |
| `src/components/RenameUserForm.tsx` | Name editing and mutation feedback |
| `src/tests/` | Component tests and shared setup |
| `src/tests/e2e/` | Playwright browser tests |
| `server/schema.ts` | Sample data, GraphQL types and resolvers |
| `server/index.ts` | HTTP server |
| `server/schema.test.ts` | Backend schema and mutation tests |
| `server/tsconfig.json` | Backend TypeScript configuration |
| `vite.config.ts` | Frontend, development proxy and component-test configuration |
| `vitest.server.config.ts` | Node-based backend test configuration |
| `playwright.config.ts` | Browser tests and server startup |

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the frontend |
| `npm run dev:server` | Start the backend in watch mode |
| `npm run format` | Format files |
| `npm run format:check` | Check formatting |
| `npm run lint` | Run ESLint |
| `npm run typecheck:server` | Check backend TypeScript without emitting files |
| `npm run build` | Check frontend and backend types, then build the frontend |
| `npm test` | Run component tests in watch mode |
| `npm run test:run` | Run component tests once |
| `npm run test:server` | Run backend tests once |
| `npm run test:e2e` | Run browser tests |
| `npm run test:e2e:headed` | Run browser tests with a visible browser |
| `npm run test:all` | Run component, backend and browser tests in sequence |

## Testing

The completed demo contains **14 tests**:

- **7 frontend tests:** page rendering, user lookup, missing users, errors, name editing and blank-name prevention. API responses are mocked.
- **3 backend tests:** execute the real schema to check mutation updates, subsequent queries, name validation and unknown users.
- **4 browser tests:** exercise the page, real user lookups, missing-user feedback and renaming followed by a page reload.

Playwright starts the frontend and backend automatically, or reuses running local servers. The rename browser test restores the sample name in a `finally` block. Keep the user-lookup browser tests sequential because they share mutable backend data, and restore user `1` to **Darren** before running them after manual edits.

Backend tests inline the GraphQL dependency chain in Vitest to avoid separate module-instance conflicts.

Run the complete checks with:

```bash
npm run format:check
npm run lint
npm run build
npm run test:all
```

## Scope

This project demonstrates GraphQL fundamentals and frontend integration. It uses in-memory data with no database or authentication. Frontend TypeScript response types are maintained manually and do not validate JSON at runtime.

The build produces the frontend bundle; it does not package or deploy the backend. A deployed application needs a running GraphQL server and suitable routing to it, since Vite's development proxy is not part of the frontend bundle.
