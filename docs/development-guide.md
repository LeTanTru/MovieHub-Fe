# MovieHub FE Development Guide

## Local Development

Install dependencies:

```bash
yarn install
```

Start the app:

```bash
yarn dev
```

Use the clean command when Turbopack or `.next` cache behaves oddly:

```bash
yarn clean-dev
```

Verify before committing:

```bash
yarn lint && yarn build
```

For a focused check:

```bash
yarn lint -- src/path/to/file.tsx
```

## Environment Rules

Environment validation lives in `src/config.ts`. Public variables are build-time inputs and must start with `NEXT_PUBLIC_`.

Required public variables:

```text
NEXT_PUBLIC_NODE_ENV
NEXT_PUBLIC_AUTH_API_URL
NEXT_PUBLIC_API_ENDPOINT_URL
NEXT_PUBLIC_API_MEDIA_URL
NEXT_PUBLIC_GOOGLE_LOGIN_CALLBACK_URL
NEXT_PUBLIC_URL
NEXT_PUBLIC_MEDIA_HOST
NEXT_PUBLIC_CLIENT_TYPE
NEXT_PUBLIC_MQTT_BROKER
NEXT_PUBLIC_MQTT_USERNAME
NEXT_PUBLIC_MQTT_PASSWORD
```

Server-only runtime variables:

```text
APP_USERNAME
APP_PASSWORD
GRANT_TYPE_REFRESH_TOKEN
ACCESS_KEY
```

Do not read or expose real `.env`, `.env.local`, credentials, or secret files.

## Adding A New API Feature

Follow the four-layer API pattern.

1. Add endpoint config in `src/constants/api-config.ts`.
2. Add request wrapper in `src/api-requests/<domain>.api-request.ts`.
3. Add query or mutation in `src/queries/<domain>.query.ts`.
4. Use the query/mutation from components or hooks.

Also:

- Add new query keys to `queryKeys` in `src/constants/master-data.ts`.
- Return typed API responses with `ApiResponse<T>` or `ApiResponseList<T>`.
- Use `select: (data) => data.data` in queries.
- Invalidate affected query keys after successful mutations.
- Use `notify.success()` or `notify.error()` for API mutations.
- Use `logger` for errors, not `console.log`.

## Adding A New Page

For public pages:

1. Create route under `src/app`.
2. Add metadata with `generateMetadata()` when content is SEO-relevant.
3. Prefetch server data with `getQueryClient()` and `HydrationBoundary` when the first render depends on API data.
4. Add sitemap coverage when the page should be discoverable.
5. Add JSON-LD when the page represents a known schema entity.

For protected pages:

1. Place under an existing protected prefix or update `src/proxy.ts`.
2. Ensure unauthenticated users redirect through login.
3. Use query `enabled: isAuthenticated` for user-specific data.

For auth pages:

1. Add the path to `authPaths` in `src/proxy.ts` if authenticated users should be redirected away.
2. Update robots rules if the page should not be indexed.

For public feature pages (e.g., `/room`, `/download`):

1. Add a route under `src/app/<name>/`.
2. SSR-prefetch data with `getQueryClient()` + `HydrationBoundary` when available.
3. No `proxy.ts` changes needed unless the route is auth-sensitive.
4. Add `metadata` / `generateMetadata()` for SEO visibility.

## Route And Slug Rules

Movie, watch, category, country, and topic links generally use:

```text
slug.id
```

Use helpers:

- `generateSlug()` to build URL slugs.
- `getIdFromSlug()` to extract ids from dotted slugs.
- `useSlugId()` in client components that need route params.

Plain id routes, such as `/person/[id]`, should keep the raw `id`.

## Forms

Forms use React Hook Form plus Zod:

- Schemas live in `src/schemaValidations/`.
- Form components live in `src/components/form/`.
- `BaseForm` wires Zod resolver and form state.
- Field components should receive `form.control` and a schema-backed `name`.

Keep form errors mapped through domain error maps where they exist.

## Client State

Use Zustand for cross-component client state that is not server data.

Guidelines:

- Server data belongs in TanStack Query.
- Use `useShallow` for object selectors.
- Prefer small selector hooks in `src/hooks/` when multiple components need the same slice.
- Reset state when leaving long-lived contexts if stale state can leak into another page.

## Styling And UI

The app uses Tailwind CSS v4 and shadcn/ui in the `new-york` style.

Conventions:

- Use `cn()` from `@/lib` for class composition.
- Use existing components from `src/components/ui/` and `src/components/form/`.
- Keep private route-local components under `_components/`.
- Use configured responsive breakpoints such as `max-990`, `max-860`, `max-768`, `max-640`, `max-520`, `max-480`, and `max-420`.
- Use lucide/react-icons where existing components already do.

## Video Workflows

When changing watch behavior:

- Start from `src/app/watch/[slug]/_context/watch-player-context.tsx`.
- Keep playback state and navigation logic in watch-specific hooks/context.
- Keep `src/components/video-player/video-player.tsx` reusable.
- Preserve watch-history updates, continue-watching modal behavior, skip intro/outro, and episode navigation.
- Use `renderVideoUrl()`, `renderImageUrl()`, and `renderVttUrl()` for media URLs.

## Notifications And Realtime

Mutation notifications should use `notify`.

Realtime MQTT updates should usually invalidate React Query keys, not mutate component state directly. Notification-related invalidation typically touches:

```text
queryKeys.UNREAD_NOTIFICATION_COUNT
queryKeys.NOTIFICATION_LIST
```

## Commit And CI Notes

Commit messages should follow Conventional Commits:

```text
type(scope): description
```

Husky and lint-staged run ESLint and Prettier on staged files.

Pushing to `main` triggers the Docker build/deploy workflow. Treat `main` as deploy-sensitive.

## Common Pitfalls

- Do not bypass `src/utils/http.util.ts` for backend requests.
- Do not use `data.data` in components when queries already use `select`.
- Do not forget to add query keys for new query hooks.
- Do not access protected user data without `enabled: isAuthenticated`.
- Do not add auth/protected routes without checking `src/proxy.ts`.
- Do not read real secret files or commit environment values.
- Do not use `console.log`; use `logger`.
- Do not assume `slug` always contains an id. Plain `[id]` routes exist.
- Do not define `ToxicSpan` locally; import from `@/types/comment.type`.
- Do not store `toxicSpans` as a parsed array in API types; it arrives as a JSON string and must be parsed with `parseJSON<ToxicSpan[]>()`.
