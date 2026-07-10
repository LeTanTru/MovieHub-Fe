# MovieHub FE Architecture

Reviewed: 2026-06-18

## Architecture Shape

MovieHub FE is a Next.js App Router application with a strict domain-layered data flow:

```text
src/constants/api-config.ts
  -> src/api-requests/<domain>.api-request.ts
  -> src/queries/<domain>.query.ts
  -> route/component/hook
```

Do not call backend URLs directly from components. Add or change endpoints in this order so request options, auth behavior, query keys, and response unwrapping stay consistent.

## API Configuration Layer

`src/constants/api-config.ts` is the source of truth for backend endpoints. Each endpoint can define:

- `baseUrl`
- HTTP `method`
- base `headers`
- auth behavior with `ignoreAuth`
- `isRequiredXClientType`
- `isRequiredCsrfToken`
- upload behavior with `isUpload`

Endpoints are grouped by domain, such as `movie`, `category`, `person`, `account`, `file`, `notification`, `playlist`, `review`, `comment`, `room`, `survey`, and `settings`.

Path parameters use `:id` placeholders:

```ts
baseUrl: `${AppConstants.apiUrl}/v1/movie/get/:id`;
```

The shared HTTP utility replaces placeholders from `payload.pathParams`.

## HTTP Client

`src/utils/http.util.ts` wraps Axios and handles cross-cutting request behavior:

- Reads access token from Zustand on the client.
- Reads access token from cookies on the server.
- Adds `Authorization: Bearer ...` unless `ignoreAuth` is set.
- Adds `X-Client-Type` when `isRequiredXClientType` is true.
- Adds CSRF token when `isRequiredCsrfToken` is true.
- Converts upload bodies to `FormData`.
- Substitutes path params such as `:id`.
- Applies a 10 second timeout.
- Handles 401 refresh with a single refresh queue to avoid parallel refresh races.

Refresh flow:

1. A request receives `401`.
2. If a refresh is already running, the request waits in `failedQueue`.
3. Otherwise `refreshToken()` calls the internal `/api/auth/refresh-token` route.
4. On success, queued requests retry with the new access token.
5. On hard auth failure, cookies/state are cleared and the user is redirected to login.

Change auth/session behavior in the internal auth route handlers or HTTP utility, not in individual feature components.

## API Request Layer

Files in `src/api-requests/` are thin wrappers around `http`.

Example shape:

```ts
export const getById = (id: string) =>
  http.get<ApiResponse<MovieResType>>(apiConfig.movie.getById, {
    pathParams: { id }
  });
```

Conventions:

- File name: `<domain>.api-request.ts`.
- Return `ApiResponse<T>` or `ApiResponseList<T>`.
- Keep request body, query params, and path params explicit.
- Export through `src/api-requests/index.ts`.

## Query Layer

Files in `src/queries/` wrap API requests with TanStack Query.

Typical query:

```ts
return useQuery({
  queryKey: [queryKeys.MOVIE, id],
  queryFn: () => movieApiRequest.getById(id),
  enabled: !!id,
  select: (data) => data.data
});
```

Important conventions:

- Query keys come from `queryKeys` in `src/constants/master-data.ts`.
- Every `useQuery` should unwrap API responses with `select`.
- Components receive unwrapped data and should not chain `data.data`.
- Use `keepPreviousData` for paginated or filtered UIs that should not blank during navigation.
- Use `invalidateQueries()` from `src/utils/query.util.ts` after successful mutations.

## SSR Prefetch And Hydration

Route pages prefetch data on the server with `getQueryClient()`, then wrap the client tree in `HydrationBoundary`.

High-value examples:

- `src/app/(home)/page.tsx`
- `src/app/movie/[slug]/page.tsx`
- `src/app/watch/[slug]/page.tsx`
- `src/app/search/page.tsx`
- `src/app/room/page.tsx`
- category, country, person, topic, schedule, and listing pages

The route page should prefetch the same query key and params used by the client query hook. If the key or params differ, hydration is missed and the client will refetch.

`getQueryClient()` returns:

- a fresh `QueryClient` on the server
- a singleton `QueryClient` in the browser

Default query behavior:

```text
staleTime: 60 seconds
retry: false
refetchOnWindowFocus: false
```

## State Management

Zustand stores in `src/store/` hold client-only state:

| Store               | Purpose                                                      |
| ------------------- | ------------------------------------------------------------ |
| `auth.store.ts`     | Access token, CSRF token, profile, user kind                 |
| `movie.store.ts`    | Current movie, movie people, selected season, discussion tab |
| `search.store.ts`   | Header/search keyword state                                  |
| `playlist.store.ts` | Selected playlist                                            |
| `comment.store.ts`  | Reply/edit state and comment scroll targets                  |
| `category.store.ts` | Category client state                                        |

Use `useShallow` for selectors that return objects. Several hooks in `src/hooks/` wrap store selectors to avoid repeated selector code in components.

## Auth And Session Architecture

The browser does not call auth backend endpoints directly for core session work. It uses internal Next route handlers under `src/app/api/auth/*`.

Key routes:

| Route                     | Purpose                                                                           |
| ------------------------- | --------------------------------------------------------------------------------- |
| `/api/auth/login`         | Validates credentials, calls auth API, sets access/refresh/user kind/CSRF cookies |
| `/api/auth/login/google`  | Completes Google login flow                                                       |
| `/api/auth/refresh-token` | Refreshes session from refresh token cookie                                       |
| `/api/auth/session`       | Returns current session and refreshes if needed                                   |
| `/api/auth/logout`        | Calls backend logout and clears local cookies                                     |

`AppProvider` calls `useSession()` to hydrate auth state from cookies, then calls `useProfileQuery()` once an access token exists.

Route protection is in `src/proxy.ts`:

- Protected prefixes: `/account`, `/survey`, `/user`
- Public auth pages: `/forgot-password`, `/intro`, `/login`, `/register`, `/verify-otp`
- Authenticated users are redirected away from auth pages.
- Unauthenticated users are redirected to login with a `redirect` query param for protected pages.

## Content Moderation: Toxic Spans

The platform flags toxic content using character-level span annotations.

`ToxicSpan` is the canonical type defined in `src/types/comment.type.ts`:

```ts
export type ToxicSpan = { start: number; end: number };
```

- `CommentResType.toxicSpans`: JSON-serialized `ToxicSpan[]` or `null`.
- `ReviewResType.toxicSpans`: same format.
- `ToxicCommentLockedNotificationType.toxicSpans`: already parsed `ToxicSpan[]` delivered via MQTT notification.

Rendering pattern in comments and reviews:

1. Parse `toxicSpans` strings with `parseJSON<ToxicSpan[]>()`.
2. Blur specific toxic text segments when span data exists.
3. Blur the whole block when hidden content has no specific spans.
4. Keep reveal state local to the rendered item.

## Video Playback Architecture

The watch page is centered around:

- `src/app/watch/[slug]/page.tsx` for SSR prefetch and metadata.
- `src/contexts/watch-player-context.tsx` for playback state/actions.
- `src/hooks/` for continue-watching, episode navigation, intro/outro skip, player settings, watch history, and player data.
- `src/components/video-player/video-player.tsx` for the reusable Vidstack player.

The player supports:

- HLS playback.
- Internal-source auth token injection.
- Quality selection.
- Captions/subtitles.
- VTT thumbnails.
- Skip intro/outro controls.
- Previous/next episode buttons.
- Watch-history time updates and resume modal.

Keep video domain logic in watch context/hooks where possible. Keep the reusable player generic.

## Realtime Notifications

MQTT is initialized through `src/lib/mqtt.ts` and mounted globally by `MqttProvider`.

`MqttProvider` subscribes to:

- a general movie topic
- an account-specific topic when the profile id exists

Message handlers invalidate notification query keys so UI data updates through React Query instead of manual state patching.

## SEO And Metadata

The app uses Next metadata APIs plus JSON-LD components in `src/components/seo`.

Patterns:

- Route pages define `metadata` or `generateMetadata()`.
- Some public pages use `generateStaticParams()` and `revalidate`.
- Movie detail emits movie schema.
- Watch page emits video schema.
- Person page emits person schema.
- `src/app/sitemap.ts` generates sitemap URLs.
- `src/app/robots.ts` controls crawl access.
- `src/app/og/route.tsx` generates the Open Graph image.

When adding public pages, add metadata, sitemap coverage if relevant, and robot/proxy rules if the route is auth-sensitive.
