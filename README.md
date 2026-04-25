# MovieHub

**MovieHub** is a Vietnamese movie streaming platform built with Next.js 16, React 19, and TypeScript. It provides a complete movie discovery, playback, and social engagement experience with a scalable, production-ready architecture.

## Features

### Movie Discovery & Browsing

- Browse by categories, countries, actors, directors, and curated collections
- Search with debounced queries and advanced filters (genre, year, language, age rating)
- Movie schedules, topic-based collections, and top-view tracking
- Single movies and TV series support with season/episode navigation
- Personalized suggestions based on viewing history

### Video Playback

- Custom video player powered by **Vidstack** + **HLS.js**
- Quality selection, subtitle/caption support with language normalization
- Skip intro/outro buttons, episode auto-next, and watch progress tracking
- Trailer modal previews and HLS DRM token authentication
- Thumbnail VTT preview on seek bar

### User Experience

- **Authentication**: Email/password login, registration with OTP, Google OAuth, anonymous token support
- **Profile Management**: Avatar upload, profile editing, password changes, account settings
- **Personalization**: Favorites (movies & people), custom playlists with drag-and-drop ordering, watch history
- **Social Features**: Nested comments with voting, reviews with 5-star ratings, discussion threads
- **Notifications**: Toast notifications via React Toastify

### Responsive Design

- Mobile-first with custom breakpoints (`max-990`, `max-860`, `max-768`, `max-640`, `max-520`, `max-480`, `max-420`)
- Dark/light theme with system preference support
- Accessible UI built on Radix primitives and shadcn/ui

## Tech Stack

| Category               | Technology                                |
| ---------------------- | ----------------------------------------- |
| **Framework**          | Next.js 16 (App Router), React 19         |
| **Language**           | TypeScript 5                              |
| **Data Fetching**      | TanStack React Query 5, Axios             |
| **State Management**   | Zustand                                   |
| **Forms & Validation** | React Hook Form, Zod                      |
| **Styling**            | Tailwind CSS v4, shadcn/ui, Framer Motion |
| **Video Player**       | Vidstack, HLS.js                          |
| **Rich Text**          | TinyMCE                                   |
| **Drag & Drop**        | dnd-kit                                   |
| **Charts**             | Recharts                                  |
| **Carousel**           | Swiper                                    |
| **Notifications**      | React Toastify                            |
| **CI/CD**              | GitHub Actions + Docker                   |

## Architecture

### Data Flow Pattern

```
api-config.ts → *.api-request.ts → *.query.ts → Component
```

1. Define endpoints in `src/constants/api-config.ts`
2. Create request wrappers in `src/api-requests/<domain>.api-request.ts`
3. Build React Query hooks in `src/queries/<domain>.query.ts`
4. Consume in components with centralized `queryKeys`

### State Management

- **Server State**: TanStack React Query with `HydrationBoundary` for SSR prefetching
- **Client State**: Zustand stores (auth, movie, search, playlist, comment, category, app loading)

### HTTP Layer

Centralized Axios instance (`src/utils/http.util.ts`) with:

- Automatic Bearer token injection from cookies/localStorage
- 401 token refresh with request queue (prevents parallel refresh races)
- Cookie synchronization via internal API routes (`src/app/api/auth/*`)
- FormData support for file uploads
- Path parameter substitution (`:id` → value)

### Route Protection

Guarded by `src/proxy.ts` (Next.js middleware):

- **Protected**: `/user/*`, `/account/*`, `/survey`
- **Public Auth**: `/login`, `/register`, `/forgot-password`, `/verify-otp`

## Project Structure

```
src/
├── api-requests/          # Domain-based API request wrappers (18 files)
├── app/                   # Next.js App Router pages & layouts
│   ├── (auth)/            # Auth route group (login, register, etc.)
│   ├── (home)/            # Homepage with slider, topics, collections
│   ├── movie/[slug]/      # Movie detail pages
│   ├── watch/[slug]/      # Video playback pages
│   ├── search/            # Search results
│   ├── category/[slug]/   # Category listings
│   ├── country/[slug]/    # Country listings
│   ├── person/            # People directory
│   ├── topic/             # Topic listings
│   ├── schedule/          # Movie schedule
│   ├── user/              # Protected user pages (favorites, playlists, etc.)
│   ├── account/           # Protected account pages (profile, settings)
│   ├── api/auth/          # Server-side auth API routes
│   └── actions/           # Server actions
├── components/
│   ├── ui/                # shadcn/ui primitives (21 components)
│   ├── form/              # Form components with validation (17 files)
│   ├── video-player/      # Custom Vidstack-based video player
│   ├── app/               # App-level components (movie cards, header, footer, etc.)
│   ├── layout/            # Layout wrappers
│   ├── providers/         # React context providers
│   └── modal/             # Modal components
├── constants/             # API endpoints, query keys, master data
├── hooks/                 # Custom React hooks (15 hooks)
├── queries/               # React Query hooks (18 files)
├── store/                 # Zustand stores (7 stores)
├── schemaValidations/     # Zod validation schemas (19 files)
├── types/                 # TypeScript type definitions (27 files)
├── utils/                 # Utility functions (HTTP, notify, storage, etc.)
├── routes/                # Route definitions
├── lib/                   # Utility library (cn function)
├── logger/                # Logging configuration
├── config.ts              # Environment variable validation (Zod)
└── proxy.ts               # Route protection middleware
```

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn

### Installation

```bash
yarn install
```

### Environment Setup

Copy `.env.example` to `.env.local` and configure:

```env
APP_USERNAME=
APP_PASSWORD=
GRANT_TYPE_REFRESH_TOKEN=
ACCESS_KEY=

NEXT_PUBLIC_NODE_ENV=development
NEXT_PUBLIC_AUTH_API_URL=
NEXT_PUBLIC_API_ENDPOINT_URL=
NEXT_PUBLIC_API_MEDIA_URL=
NEXT_PUBLIC_GOOGLE_LOGIN_CALLBACK_URL=
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_MEDIA_HOST=
NEXT_PUBLIC_CLIENT_TYPE=
```

> Environment variables are validated at startup via Zod in `src/config.ts`. Missing or invalid values will fail the build.

### Development

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production

```bash
yarn build && yarn start
```

### Docker

```bash
docker build \
  --build-arg NEXT_PUBLIC_NODE_ENV=production \
  --build-arg NEXT_PUBLIC_AUTH_API_URL=... \
  --build-arg NEXT_PUBLIC_API_ENDPOINT_URL=... \
  --build-arg NEXT_PUBLIC_API_MEDIA_URL=... \
  --build-arg NEXT_PUBLIC_GOOGLE_LOGIN_CALLBACK_URL=... \
  --build-arg NEXT_PUBLIC_URL=... \
  --build-arg NEXT_PUBLIC_MEDIA_HOST=... \
  --build-arg NEXT_PUBLIC_CLIENT_TYPE=... \
  -t moviehub-fe .

docker run -p 3000:3000 \
  -e APP_USERNAME=... \
  -e APP_PASSWORD=... \
  -e GRANT_TYPE_REFRESH_TOKEN=... \
  -e ACCESS_KEY=... \
  moviehub-fe
```

## Scripts

| Command                             | Description                              |
| ----------------------------------- | ---------------------------------------- |
| `yarn install`                      | Install dependencies                     |
| `yarn dev`                          | Start dev server (port 3000, Turbopack)  |
| `yarn clean-dev`                    | Clean `.next` cache and start dev server |
| `yarn build`                        | Build production bundle                  |
| `yarn start`                        | Start production server                  |
| `yarn lint`                         | Run ESLint on all files                  |
| `yarn lint -- src/path/to/file.tsx` | Lint a single file                       |
| `yarn format`                       | Format code with Prettier                |

**Pre-commit**: Husky + lint-staged runs ESLint + Prettier on staged files automatically.

## Key Conventions

- Use `@/*` alias for imports from `src/` (configured in `tsconfig.json`)
- Server components by default; add `'use client'` for client components
- Use `cn()` from `@/lib` for className composition (`twMerge(clsx(...))`)
- Query keys centralized in `src/constants/master-data.ts` (`queryKeys`)
- Notifications via `notify.success()` / `notify.error()` from `@/utils`
- Logging via `logger` from `@/logger` (not `console.log`)
- Conventional commits enforced via `@commitlint/cli` (`type(scope): description`)
- Barrel exports via `index.ts` in: `api-requests/`, `queries/`, `hooks/`, `store/`, `constants/`, `utils/`, `types/`, `routes/`, `schemaValidations/`

### Naming Conventions

| Type           | Pattern                   | Example                |
| -------------- | ------------------------- | ---------------------- |
| Components     | PascalCase                | `CommentItem.tsx`      |
| Hooks          | camelCase with `use-`     | `use-auth.ts`          |
| API files      | `<domain>.api-request.ts` | `movie.api-request.ts` |
| Query files    | `<domain>.query.ts`       | `movie.query.ts`       |
| Type files     | `<domain>.type.ts`        | `movie.type.ts`        |
| Schema files   | `<domain>.schema.ts`      | `auth.schema.ts`       |
| Store files    | `<domain>.store.ts`       | `auth.store.ts`        |
| Utils          | `<name>.util.ts`          | `http.util.ts`         |
| Private dirs   | `_components/` prefix     | `_components/slider/`  |
| Response types | `*ResType`                | `MovieResType`         |
| Search types   | `*SearchType`             | `MovieSearchType`      |
| Body types     | `*BodyType`               | `LoginBodyType`        |
| Store types    | `*StoreType`              | `AuthStoreType`        |

## CI/CD

GitHub Actions pipeline (`.github/workflows/docker.yml`):

1. **Build & Push**: Docker image to `${DOCKER_USERNAME}/fe-moviehub:latest`
2. **Deploy**: SSH to VPS via OpenVPN, pull and run new container
3. **Notify**: Discord webhook with build status and commit details

## License

MIT
