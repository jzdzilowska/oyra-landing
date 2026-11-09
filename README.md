# Oyra landing page

A responsive, monochrome website for Oyra material sourcing software. The site introduces the workflow, includes an interactive example of a finish schedule and source comparison, and collects demo requests.

## Run locally

Requires Node.js 22.13 or later.

```sh
npm ci
npm run dev
```

Open the local URL printed by the server. The framework is Vinext with React and TypeScript. Source lives in `app/`, visual styles in `app/globals.css`, and local assets in `public/`.

## Demo requests

The form posts to `/api/demo`. Valid requests are stored in the Cloudflare D1 `demo_requests` table. The endpoint validates input, rejects cross-origin submissions, handles duplicate request IDs, and limits repeat submissions from the same email. There is no public endpoint exposing requests.

No calendar or email notification integration is configured. The form confirms receipt, not a booked meeting. Add scheduling and inbox notifications before using the site for a public acquisition campaign.

Generate schema migrations after changing `db/schema.ts`:

```sh
npm run db:generate
npm run build
```

For a fresh local database, apply the migration using the build-generated configuration:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_common_franklin_storm.sql
```

Run each migration only once against the local database. Production migrations are applied through the Sites publishing workflow. Local preview requests are not copied to production.

## Checks

```sh
npx tsc --noEmit
npm run build
```

## Hosting

The `.openai/hosting.json` file retains the private Sites project identity and D1 binding. Publishing uses the Sites source packaging workflow. A GitHub push by itself does not deploy the site; no GitHub deployment automation is configured.

## Images and type

The hero uses the Daniel Sessler Unsplash photograph supplied by the owner. The image is displayed in monochrome using CSS. The material study is an original generated illustration. Details are recorded in `public/images/asset-notes.txt`. Manrope is served locally with its font license.

The product example uses illustrative data and is not a live supplier catalog or quotation.
