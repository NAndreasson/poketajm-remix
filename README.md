# Poketajm

Code assignment for a Pokemon API.

TODOs:

- [ ] Code cleanup etc... 
- [ ] Add some simple Playwright tests
- [ ] Fix better accessibility for screen readers.
- [ ] Proper fuzzy search
- [ ] Fix file upload

## What's in the stack

- Database ORM with [Prisma](https://prisma.io)
- Styling with [Tailwind](https://tailwindcss.com/)
- Unit testing with [Vitest](https://vitest.dev)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

## Quickstart

## Development

- Start the Postgres Database in [Docker](https://www.docker.com/get-started):

  ```sh
  npm run docker
  ```

  > **Note:** The npm script will complete while Docker sets up the container in the background. Ensure that Docker has finished and your container is running before proceeding.

- Set up env variables

Add the following to .env (given that you're using docker as above)

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
```

- Push the DB schema

```sh
npx prisma db push
```

- Initial setup:

  ```sh
  npm run setup
  ```

- Run the first build:

  ```sh
  npm run build
  ```

- Start dev server:

  ```sh
  npm run dev
  ```

This starts your app in development mode, rebuilding assets on file changes.

### Relevant code:

Look for the queries inside app/queries

## Testing

- Set up the test DB

```sh
npm run setup:test
```

- Run the tests

```sh
npm run test
```