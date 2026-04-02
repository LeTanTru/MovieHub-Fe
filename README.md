# MovieHub Frontend

MovieHub Frontend is a feature-rich movie streaming client built with Next.js 16 (App Router), React 19, and TypeScript. It delivers movie discovery, user engagement, and video playback experiences with a scalable, production-ready architecture.

## Main Features

### Movie Discovery

- Browse movies by categories, countries, actors, directors, and curated collections
- Search functionality with debounced queries
- Movie schedules and topic-based collections
- Top views tracking and personalized suggestions
- Single movies and series support

### User Experience

- **Authentication**: Login, register, forgot password, OTP verification, Google OAuth
- **Profile Management**: Account settings, profile customization with image upload, password changes
- **Personalization**: Favorites (movies & people), custom playlists, watch history
- **Social Features**: Comments with voting, reviews with ratings, discussions
- **Notifications**: Real-time user notifications

### Video Playback

- Custom video player built with Vidstack and HLS.js
- Quality selection, caption support with language normalization
- Trailer modal previews
- Watch progress tracking

### Responsive Design

- Mobile-first approach with custom breakpoints (`max-990`, `max-860`, `max-768`, `max-640`, `max-520`, `max-480`, `max-420`)
- Dark/light theme support
- Accessible UI with Radix primitives

## Core Stack

| Category               | Technology                                |
| ---------------------- | ----------------------------------------- |
| **Framework**          | Next.js 16 (App Router), React 19         |
| **Language**           | TypeScript                                |
| **Data Fetching**      | TanStack React Query, Axios               |
| **State Management**   | Zustand                                   |
| **Forms & Validation** | React Hook Form, Zod                      |
| **Styling**            | Tailwind CSS v4, shadcn/ui, Framer Motion |
| **Video Player**       | Vidstack, HLS.js                          |
| **Rich Text**          | TinyMCE                                   |
| **Drag & Drop**        | dnd-kit                                   |
| **Charts**             | Recharts                                  |
| **Notifications**      | React Toastify                            |

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
- **Client State**: Zustand stores for auth, app loading, comments, movies, search, categories, playlists

### HTTP Layer

Centralized Axios instance (`src/utils/http.util.ts`) with:

- Automatic Bearer token injection
- 401 token refresh with request queue (prevents parallel refresh races)
- Cookie synchronization via internal API routes
- FormData support for file uploads

### Route Protection

Guarded by `src/proxy.ts`:

- **Protected**: `/user/*`, `/account/*`
- **Public Auth**: `/login`, `/register`, `/forgot-password`, `/verify-otp`

## Directory Structure

```
src/
├── api-requests/       # Domain-based API request wrappers
├── app/                # Next.js App Router pages & layouts
│   ├── (auth)/         # Auth route group (login, register, etc.)
│   ├── (home)/         # Homepage route group
│   ├── movie/[slug]/   # Movie detail pages
│   ├── watch/[slug]/   # Video playback pages
│   ├── user/           # Protected user pages
│   └── account/        # Protected account pages
├── components/         # React components
│   ├── ui/             # shadcn/ui primitives
│   ├── form/           # Form components with validation
│   ├── layout/         # Layout wrappers
│   ├── video-player/   # Custom video player
│   └── [feature]/      # Feature-specific components
├── constants/          # API endpoints, query keys, app constants
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries (cn, etc.)
├── logger/             # Logging configuration
├── queries/            # React Query hooks
├── routes/             # Route definitions & helpers
├── schemaValidations/  # Zod validation schemas
├── store/              # Zustand state stores
├── types/              # TypeScript type definitions
├── utils/              # Utility functions (HTTP, notify, etc.)
├── config.ts           # Environment variable validation
└── proxy.ts            # Route protection middleware
```

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn package manager

### Installation

1. Install dependencies:

```bash
yarn install
```

2. Create `.env.local` with required variables:

```env
NEXT_PUBLIC_NODE_ENV=development
NEXT_PUBLIC_AUTH_API_URL=
NEXT_PUBLIC_API_ENDPOINT_URL=
NEXT_PUBLIC_API_MEDIA_URL=
NEXT_PUBLIC_GOOGLE_LOGIN_CALLBACK_URL=
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_TINYMCE_URL=
NEXT_PUBLIC_APP_USERNAME=
NEXT_PUBLIC_APP_PASSWORD=
NEXT_PUBLIC_GRANT_TYPE_REFRESH_TOKEN=
NEXT_PUBLIC_MEDIA_HOST=
NEXT_PUBLIC_ACCESS_KEY=
NEXT_PUBLIC_CLIENT_TYPE=
```

> Environment variables are validated at startup in `src/config.ts`. Missing or invalid values will fail the build.

3. Start the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

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

**Pre-commit**: `lint-staged` automatically runs ESLint + Prettier on staged files via Husky hooks.

## Key Conventions

- Use `@/*` alias for imports from `src/`
- Server components by default; add `'use client'` for client components
- Use `cn()` from `@/lib` for className composition
- Query keys centralized in `src/constants/master-data.ts`
- Notifications via `notify.success()` / `notify.error()` from `@/utils`
- Logging via `logger` from `@/logger` (not `console.log`)
- Conventional commits enforced (`type(scope): description`)

## License

MIT
