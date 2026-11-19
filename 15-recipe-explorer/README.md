# Recipe Explorer

A Next.js App Router recipe browser powered by [TheMealDB](https://www.themealdb.com/api/json/v1/1/). Browse categories, search and share recipe results, view recipe details, save favourites, and discover a random meal.

## Requirements

- Node.js 20 or newer
- npm

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
npm run lint
npm run build
npm start
```

## Features and routes

- `/` — browse recipe categories.
- `/category/[name]` — browse recipes by category.
- `/meal/[id]` — recipe details, ingredient checklist, instructions, video, and favourite toggle.
- `/search?q=chicken` — shareable recipe search results.
- `/favourites` — recipes saved in the current browser.
- `GET /api/search?q=chicken` — autocomplete/search JSON; requires at least two characters.
- `GET /api/random` — uncached random-recipe lookup used by the “Surprise me” button.

TheMealDB fetch helpers live in `src/lib/mealdb.ts`. Category data is cached for 24 hours; recipe and search data for one hour. Random recipe lookups use `revalidate: 0`.

### Cache behavior

Next.js 14 cached `fetch` requests by default. Next.js 15 changed the default to uncached, so this app sets its cache policy explicitly:

- `cache: "force-cache"` stores a response in the persistent Data Cache until it is invalidated or evicted.
- `next: { revalidate: seconds }` caches a response and revalidates it after the specified interval.
- `cache: "no-store"` skips the persistent Data Cache. `next: { revalidate: 0 }` has the same uncached intent and is used for random recipes.

The category endpoint uses a 24-hour revalidation interval; category meal lists, recipe details, and search results use one hour. This project currently runs Next.js 16, but these explicit fetch settings avoid relying on the changed Next.js 14-to-15 default.

### Rendering

The production build marks routes as:

- `○` static prerendered output, including `/`, `/category/Beef`, and `/category/Chicken`.
- `◐` Partial Prerendering: a static shell with dynamic content streamed at request time, used for `/search`, `/favourites`, `/meal/[id]`, and most generated category paths.
- `ƒ` dynamic request-time rendering, used by `/api/search` and `/api/random`.

Favourites are stored as a validated JSON array of up to 50 meal IDs in the `recipe-favourites` cookie. The cookie is `httpOnly`, `SameSite=Lax`, path-wide, and secure in production. It is browser-local and does not require an account.

## Deploy to Vercel

Import the GitHub repository into [Vercel](https://vercel.com/new), select the Next.js framework preset, and deploy. The project uses the default Next.js build and output settings, so no additional environment variables are required.

Alternatively, after installing and authenticating the Vercel CLI:

```bash
vercel
vercel --prod
```
