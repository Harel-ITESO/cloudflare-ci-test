# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## CI/CD Pipeline

This project includes a GitHub Actions pipeline at `.github/workflows/ci.yml`.

- `build-and-test` job:
  - installs dependencies
  - builds the Nuxt project
  - runs unit tests with coverage (`pnpm test:coverage`)
  - publishes `coverage-report` and `nuxt-output` artifacts
- `deploy-cloudflare` job:
  - runs only on manual workflow runs (`workflow_dispatch`)
  - downloads the `nuxt-output` artifact from the validated build
  - verifies Cloudflare identity with `wrangler whoami`
  - deploys using Wrangler to the project name in secrets

### Required GitHub secrets for deploy

- `CF_API_TOKEN`
- `CF_ACCOUNT_ID`
- `CF_PROJECT_NAME`

### Manual deployment

Run the workflow manually from GitHub Actions ("Run workflow").
The deploy job is attached to the `production` environment, so you can keep approval gates there.
