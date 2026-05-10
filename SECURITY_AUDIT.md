# Security Audit Report

**Generated:** 2026-05-09 (Updated via multi-agent scan)
**Scope:** Full application security review (Auth/XSS/API/Config/Video/Infra)
**Method:** 5-agent parallel static analysis + manual validation

---

## Executive Summary

| Category | Issues Found | Critical | High | Medium | Low |
| -------- | ------------ | -------- | ---- | ------ | --- |
| Total    | 40+          | 7        | 8    | 15+    | 12+ |

### Key Findings

1. **Access Token Stored in Client-Side JavaScript** - Tokens in Zustand/localStorage vulnerable to XSS exfiltration
2. **Authorization Header Override Injection** - Arbitrary header injection via `authorization` payload param
3. **Hardcoded Service Credentials** - Basic auth credentials embedded in source code
4. **OAuth CSRF Protection Missing** - State parameter not validated in Google OAuth flow
5. **IDOR on Comment/Review Delete** - Authenticated users can delete any comment/review by ID
6. **IDOR on Playlist Operations** - Users can modify other users' playlists
7. **MQTT Credentials Exposed as Public Variables** - Client-side exposed broker credentials
8. **Missing Security Headers/CSP** - No browser-side attack mitigations configured
9. **No Rate Limiting on Auth Endpoints** - Brute force attacks feasible
10. **XSS via Insufficient HTML Sanitization** - `dangerouslySetInnerHTML` with dangerous tags allowed

---

## CRITICAL VULNERABILITIES (P0 - Fix Immediately)

### 1. Access Token Stored in Client-Side JavaScript (XSS Risk)

**Affected Files:**

- `src/utils/http.util.ts:50`
- `src/store/auth.store.ts`
- `src/app/api/auth/session/route.ts:8-14`
- `src/app/api/auth/login/route.ts:60-63`
- `src/app/api/auth/login/google/route.ts:43-45`
- `src/app/api/auth/refresh-token/route.ts:62-66`
- `src/components/providers/app-provider/app-provider.tsx:54-56`
- `src/app/(auth)/login/_components/login-form.tsx:42-45`
- `src/app/(auth)/login/_components/button-login-google.tsx:37`

**Problem:**
Access tokens are stored in Zustand (which persists to localStorage) and returned in JSON responses. Any XSS vulnerability can exfiltrate these tokens.

**Impact:**
Any XSS or malicious injected script can exfiltrate access/refresh tokens and hijack sessions.

**Fix:**

- Stop returning token material from `/api/auth/*` responses
- Keep auth tokens server-only (HttpOnly cookie/BFF pattern)
- Make `/api/auth/session` return only non-sensitive session state

---

### 2. Authorization Header Override Injection

**Location:** `src/utils/http.util.ts:166-172`

**Problem:**

```typescript
if (authorization) {
  baseHeader['Authorization'] = authorization; // Overrides Bearer token!
}
```

If `authorization` is passed in the payload, it completely overrides the Bearer token authentication.

**Impact:** An attacker could inject arbitrary authorization headers.

**Fix:** Remove the `authorization` override or enforce that it must also be a Bearer token.

---

### 3. Hardcoded Credentials in Source Code

**Location:** `src/app/api/auth/refresh-token/route.ts:33`

**Problem:**

```typescript
Authorization: `Basic ${btoa(`${process.env.APP_USERNAME}:${process.env.APP_PASSWORD}`)}`;
```

Credentials are embedded in source code and transmitted base64-encoded.

**Impact:** These credentials are visible to anyone with access to the frontend codebase.

**Fix:** Use a server-side-only secret management approach, never expose auth credentials in client-accessible code.

---

### 4. Error Response Leaks Backend Error Details

**Affected Files:**

- `src/app/api/auth/refresh-token/route.ts:77-85`
- `src/app/api/auth/login/route.ts:70-77`
- `src/app/api/auth/login/google/route.ts:62-68`
- `src/app/api/auth/logout/route.ts:24-30`

**Problem:**
Full backend error responses are forwarded to clients via `...response` spread, potentially exposing internal error messages, stack traces, and API implementation details.

**Impact:** Information disclosure helps attackers understand the system for targeted attacks.

**Fix:** Return generic error messages to clients; log full details server-side.

---

### 5. OAuth State Parameter Not Validated (CSRF Risk)

**Location:** `src/app/api/auth/login/google/route.ts`

**Problem:**
The Google OAuth flow lacks state parameter validation. The `state` parameter exists to prevent CSRF attacks but is never checked.

**Impact:** An attacker could trick a logged-in user into completing the attacker's Google login, gaining account access.

**Fix:** Generate and validate a `state` parameter during OAuth initiation.

---

### 6. IDOR in Comment Delete Operation

**Location:** `src/api-requests/comment.api-request.ts:22-25`

**Problem:**

```typescript
delete: (id: string) =>
  http.delete<ApiResponse<any>>(apiConfig.comment.delete, {
    pathParams: { id }
  }),
```

The delete function accepts only `id: string` with no user context. The API request sends only the comment ID, allowing any authenticated user to delete any comment by ID.

**Impact:** Any authenticated user can delete any comment on any movie by crafting a request with the target comment ID.

**Fix:** Backend must validate comment ownership. Frontend should include user context in the request body.

**OWASP:** A01:2021 - Broken Access Control

---

### 7. IDOR in Review Delete Operation

**Location:** `src/api-requests/review.api-request.ts:26-29`

**Problem:**
Same pattern as comment delete - accepts only resource ID with no ownership validation.

**Impact:** Authenticated users can delete any review by guessing/knowing the review ID.

**Fix:** Backend must validate review ownership before deletion.

**OWASP:** A01:2021 - Broken Access Control

---

## HIGH VULNERABILITIES (P1 - Fix Soon)

### 8. MQTT Credentials Exposed as Public Variables

**Location:** `src/config.ts:14-15`, `src/lib/mqtt.ts:9-11`

**Problem:**

```typescript
NEXT_PUBLIC_MQTT_BROKER: z.string(),
NEXT_PUBLIC_MQTT_USERNAME: z.string(),
NEXT_PUBLIC_MQTT_PASSWORD: z.string()
```

MQTT credentials are stored in `NEXT_PUBLIC_*` variables, exposing them to client-side code.

**Impact:** Any user can view these credentials in browser devtools and gain broker access.

**Fix:** Use server-side-only env vars for MQTT credentials, or use a server-side proxy for MQTT connections.

---

### 9. Token Refresh Race Condition Handler

**Location:** `src/utils/http.util.ts:25-41`, `src/utils/http.util.ts:68-81`

**Problem:**
While the queued request pattern is correct for handling concurrent refresh attempts, if multiple tabs trigger refresh simultaneously or if the refresh fails mid-retry, requests can stall or fail.

**Impact:** Brief authentication lapses possible; potential for queue stalls.

**Fix:** Add exponential backoff and max retry limits; force logout when refresh definitively fails.

---

### 10. Missing Baseline Security Headers and CSP

**Location:** `next.config.ts:6-46`

**Problem:**
No global `headers()` policy is configured; no Content Security Policy, HSTS, frame-ancestor hardening, MIME-sniff protection, or permissions policy is applied.

**Impact:**
Higher exploitation impact for XSS, clickjacking, content-type confusion, and browser policy bypasses.

**Fix:**
Add centralized headers in `next.config.ts`:

- `Content-Security-Policy`
- `Strict-Transport-Security`
- `X-Frame-Options` (or CSP `frame-ancestors`)
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Permissions-Policy`

---

### 11. GitHub Actions Are Not Pinned to Immutable SHAs

**Location:** `.github/workflows/docker.yml:13,16,19,25`

**Problem:**
Workflow uses tag-based action refs (`@v4`, `@v3`, `@v6`) instead of commit SHA pinning.

**Impact:**
If an upstream action tag is compromised/moved, attacker-controlled code may run in CI with repository secrets.

**Fix:** Pin all third-party actions to full commit SHAs and periodically rotate pin updates.

---

### 12. SSH Host Trust Bootstrap Uses Raw `ssh-keyscan` (TOFU)

**Location:** `.github/workflows/docker.yml:73`

**Problem:**
Host key is fetched dynamically and trusted without fingerprint verification.

**Impact:** MITM during bootstrap could poison `known_hosts` and compromise deployment commands/secrets.

**Fix:** Store the expected host fingerprint in secrets/repo and verify before adding to `known_hosts`.

---

### 13. IDOR in Playlist Item Removal

**Location:** `src/api-requests/playlist.api-request.ts:41-44`

**Problem:**
`RemoveItemSearchType` contains only `{ movieId, playlistId }` with no user context.

**Impact:** A user could potentially remove movies from other users' playlists if they know the playlist ID.

**Fix:** API should validate playlist ownership server-side.

**OWASP:** A01:2021 - Broken Access Control

---

### 14. IDOR in Playlist Deletion

**Location:** `src/api-requests/playlist.api-request.ts:28-31`

**Problem:**
Deleting by playlist ID alone without user verification allows deletion of any playlist.

**Impact:** Any user can delete any playlist by ID.

**Fix:** Backend must validate playlist ownership before deletion.

**OWASP:** A01:2021 - Broken Access Control

---

### 15. Mass Assignment - Comment ID Override

**Location:** `src/components/app/comment/comment-form.tsx:105-108`

**Problem:**

```typescript
const payload = editingComment ? { ...values, id: editingComment.id } : values;
```

The client explicitly controls which comment ID gets updated. The schema allows `id` to be optional/nullable.

**Impact:** If the `editingComment` state is manipulated, a user could update comments belonging to other users.

**Fix:** Remove `id` from client-controlled payload. The ID should be determined server-side based on the authenticated user's session.

**OWASP:** A01:2021 - Broken Access Control

---

### 16. Mass Assignment - Review Schema ID Override

**Location:** `src/schemaValidations/review.schema.ts:3-8`

**Problem:**

```typescript
export const reviewSchema = z.object({
  id: z.string().optional().nullable(), // Client can set this
  content: z.string().optional().nullable(),
  movieId: z.string().nonempty('Bắt buộc'),
  rate: z.number()
});
```

The `id` field is optional and can be set by the client during review creation/update.

**Impact:** Users could potentially manipulate the review ID in the payload.

**Fix:** Remove `id` from client-submitted schema for updates; use server-determined ID from session.

**OWASP:** A01:2021 - Broken Access Control

---

### 17. Sensitive Data Stored in localStorage

**Location:** `src/utils/storage.util.ts:3-11`, `src/utils/http.util.ts:157-158`

**Problem:**

```typescript
export const setData = (key: string, value: string): void => {
  if (isBrowser()) {
    localStorage.setItem(key, value); // Vulnerable to XSS
  }
};
```

`X_CLIENT_TYPE` is stored in localStorage. Any XSS vulnerability could exfiltrate this data.

**Impact:** localStorage is accessible to all JS running on the page. Tokens stored here are vulnerable to XSS attacks.

**Fix:** Store sensitive identifiers in httpOnly cookies or memory-only variables.

**OWASP:** A02:2021 - Cryptographic Failures

---

## MEDIUM VULNERABILITIES (P2 - Plan Fix)

### 18. No Rate Limiting on Authentication Endpoints

**Location:** All auth routes in `src/app/api/auth/**/route.ts`

**Problem:** No rate limiting middleware present in login, refresh-token, or logout routes.

**Impact:** Brute force attacks possible; denial of service via repeated login attempts.

**Fix:** Implement rate limiting (e.g., `express-rate-limit` or Next.js middleware).

---

### 19. Logout Error Doesn't Invalidate Session

**Location:** `src/app/api/auth/logout/route.ts:12-17`

**Problem:**

```typescript
if (res.result) {
  await removeCookie(storageKeys.ACCESS_TOKEN);
  await removeCookie(storageKeys.REFRESH_TOKEN);
}
// If res.result is false, cookies are NOT removed!
```

When the logout API call fails, local cookies are not cleared.

**Impact:** User believes they're logged out but retains active session.

**Fix:** Always clear cookies on logout attempt, regardless of API response.

---

### 20. Session Endpoint Returns Raw Token

**Location:** `src/app/api/auth/session/route.ts`

**Problem:**

```typescript
return NextResponse.json({
  data: {
    accessToken: accessTokenCookie // Returns raw token!
  }
});
```

The session endpoint returns the raw access token in the response body.

**Impact:** Token leakage if this endpoint is called from a compromised context.

**Fix:** Remove token from response; use token to fetch user session data server-side only.

---

### 21. Cookie `sameSite` Set to `lax` Instead of `strict`

**Location:** Multiple route files (`login/route.ts:40-48`, etc.)

**Problem:**

```typescript
sameSite: 'lax',  // Should be 'strict' for sensitive operations
```

`sameSite: 'lax'` allows cookies to be sent on top-level navigation.

**Impact:** Increased CSRF risk.

**Fix:** Use `sameSite: 'strict'` for sensitive authentication cookies.

---

### 22. Permissive CSS `font-family` Regex in Sanitization

**Location:** `src/utils/sanitize.util.ts:153`

**Problem:**

```javascript
'font-family': [/.*/],  // allows ANY font-family value
```

The `style` attribute is allowed on ALL tags with an extremely permissive `font-family` regex.

**Impact:** CSS injection possible through carefully crafted style attributes.

**Fix:** Replace `/.*/` with a safer pattern that only allows common font names.

---

### 23. Console Logging of MQTT Notification Data

**Location:** `src/components/providers/mqtt-provider/mqtt-provider.tsx:63-76`

**Problem:**

```typescript
logger.info(
  `[MQTT] Received MQTT message on topic: ${topic}`,
  parseJSON(message.toString())
);
```

All MQTT messages are logged to console with full message content.

**Impact:** Sensitive notification data exposed in browser devtools.

**Fix:** Remove verbose logging or use a debug-level flag that is disabled in production.

---

### 24. No TLS/SSL Encryption Configured for MQTT

**Location:** `src/lib/mqtt.ts:9-15`

**Problem:**

```typescript
client = mqtt.connect(envConfig.NEXT_PUBLIC_MQTT_BROKER as string, {
  // No TLS options configured
});
```

No explicit TLS options. Credentials sent in plain text if broker doesn't enforce TLS.

**Impact:** Man-in-the-middle attacks could intercept MQTT credentials.

**Fix:** Explicitly configure TLS:

```typescript
ssl: true,
rejectUnauthorized: true
```

---

### 25. `Secure` Cookie Flag Depends on Public Env Variable

**Location:** `src/config.ts:5,16`, `src/app/api/auth/login/route.ts:44`

**Problem:** Cookie `secure` is gated by `NEXT_PUBLIC_NODE_ENV === 'production'`.

**Impact:** Misconfiguration can issue auth cookies without `Secure` in production-like deployments.

**Fix:** Use trusted server-side environment (`process.env.NODE_ENV`) for cookie security decisions.

---

### 26. React Query Devtools Always Rendered in Production

**Location:** `src/components/providers/query-provider/query-provider.tsx:5,18`

**Problem:** `<ReactQueryDevtools />` is mounted unconditionally.

**Impact:** Exposes cache structure and potentially sensitive response metadata in production.

**Fix:** Gate rendering by environment (`NODE_ENV !== 'production'`).

---

### 27. XSS via Insufficient HTML Sanitization

**Location:** `src/utils/sanitize.util.ts:61,101-108`

**Problem:**

```ts
allowedTags: [..., 'iframe', 'video', 'audio', 'source', ...],
iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen', 'allow', 'title']
```

`iframe`, `video`, `audio`, `source` tags are allowed. Whitelist could be bypassed via punycode or URL encoding.

**Impact:** Stored XSS possible via movie descriptions containing malicious `<video>` or `<iframe>` tags with `javascript:` URLs.

**Fix:** Remove dangerous tags from allowedTags or add strict hostname validation.

**OWASP:** A03:2021 - Injection

---

### 28. Unvalidated VTT URLs Passed to Player Components

**Location:**

- `src/components/video-player/video-player.tsx:191-193`
- `src/components/video-player/_components/time-slider.tsx:50`

**Problem:**

```typescript
{textTracks?.map((track) => (
  <Track {...(track as any)} key={track.src} />  // No validation of track.src
))}
```

VTT URLs are not validated before being passed to player components.

**Impact:** Malicious VTT files could be served from external domains. VTT spec allows embedding scripts via cue points.

**Fix:** Validate all VTT URLs are from trusted domains before passing to player.

**OWASP:** A05:2021 - Security Misconfiguration

---

### 29. Path Traversal via Unsanitized pathParams

**Location:** `src/utils/http.util.ts:178-180`

**Problem:**

```typescript
Object.entries(pathParams).forEach(([key, value]) => {
  baseUrl = baseUrl.replace(`:${key}`, value.toString());
});
```

If path parameters aren't validated, attackers could inject values like `../../../etc/passwd`.

**Impact:** Potential path traversal attacks if backend doesn't validate URLs.

**Fix:** Add URL sanitization/validation for pathParams before replacement.

**OWASP:** A03:2021 - Injection

---

### 30. Duplicate Conflicting Refresh Token Endpoints

**Location:** `src/constants/api-config.ts:30-35` vs `src/constants/api-config.ts:125-130`

**Problem:**

```typescript
// Two different refresh token endpoints:
api: {
  auth: {
    refreshToken: { baseUrl: '/api/auth/refresh-token' }  // Internal
  }
},
user: {
  refreshToken: {
    baseUrl: `${AppConstants.authApiUrl}/api/token`  // Direct to auth server
  }
}
```

`http.util.ts:44` uses internal route while `refresh-token/route.ts:25` uses external. Creates confusion and potential token leakage.

**Impact:** Token leakage if internal endpoint is called directly with credentials.

**Fix:** Consolidate to single refresh mechanism.

**OWASP:** A05:2021 - Security Misconfiguration

---

### 31. Excessive Data Exposure - User Permissions

**Location:** `src/types/favourite.type.ts:7-36`

**Problem:**
`UserResType` exposes full user group details including permissions and system role flags.

**Impact:** Sensitive user metadata including permissions and system roles exposed to frontend.

**Fix:** Create sanitized response types that exclude sensitive fields.

**OWASP:** A04:2021 - Security Misconfiguration

---

### 32. No CSRF Protection on State-Changing Operations

**Location:** `src/constants/api-config.ts`, `src/app/api/auth/login/route.ts`

**Problem:**
Cookies with `sameSite: 'lax'` are sent on top-level navigation POST requests. No CSRF tokens implemented.

**Impact:** Attackers can craft malicious pages that perform state-changing operations via CSRF.

**Fix:** Implement CSRF tokens for all state-changing operations, or use `sameSite: 'strict'`.

**OWASP:** A01:2021 - Broken Access Control

---

### 33. Insufficient Session Expiration Handling

**Location:** `src/utils/http.util.ts:105-112`

**Problem:**
On invalid refresh token, forcibly redirects to login with `window.location.href`, losing all client-side state.

**Impact:** User loses all client-side state. No grace period or retry mechanism.

**Fix:** Implement proper session timeout UI, smoother redirect flow.

**OWASP:** A07:2021 - Identification and Authentication Failures

---

### 34. No JWT Signature Verification in Client

**Location:** `src/utils/jwt.util.ts:4-13`

**Problem:**

```typescript
export const decodeJwt = (token: string) => {
  try {
    return jwtDecode(token); // Only decodes, doesn't verify signature
  } catch (error) {
    logger.error('[DECODE_JWT_ERROR]', error);
    return null;
  }
};
```

`jwtDecode` only decodes, doesn't verify signature. If tokens are tampered client-side, no detection occurs.

**Impact:** Tampered tokens would be accepted without detection.

**Fix:** Use a library that verifies signatures if client-side token validation is required.

**OWASP:** A05:2021 - Security Misconfiguration

---

### 35. Outdated Dependencies

**Location:** `package.json`

**Problem:**

- `axios`: 1.13.2 (latest: 1.16.0) - may contain security fixes for SSRF
- `sanitize-html`: ^2.17.0 (latest: 2.17.3) - HTML sanitization patches

**Impact:** Known vulnerabilities may exist in outdated dependencies.

**Fix:** `yarn upgrade axios@latest sanitize-html@latest`

**OWASP:** A06:2021 - Vulnerable Components

---

### 36. Client-Side Only Path Parameter Encoding

**Location:** `src/utils/url.util.ts:19`

**Problem:**

```typescript
return encodeURIComponent(params[key]);
```

`encodeURIComponent` doesn't encode all dangerous characters (e.g., `<`, `>`, `"`).

**Impact:** For URL path segments, this encoding may be insufficient.

**Fix:** Consider using more aggressive encoding for path parameters.

**OWASP:** A05:2021 - Security Misconfiguration

---

## LOW VULNERABILITIES (P3 - Nice to Have)

### 37. Path Matching Could Allow Bypass

**Location:** `src/proxy.ts:20`

**Problem:**

```typescript
if (privatePaths.some((p) => pathname.startsWith(p))) {
```

Uses `startsWith` which could theoretically match unintended paths.

**Impact:** Unlikely with current path list, but not robust.

**Fix:** Use exact matching or a path-to-regex library.

---

### 38. Insufficient Input Validation on Login

**Location:** `src/app/api/auth/login/route.ts:26-30`

**Problem:** Only checks presence, not format. No email format validation or password complexity requirements.

**Impact:** Weak passwords accepted; invalid email formats processed.

**Fix:** Add format validation (e.g., email regex, password min-length/complexity).

---

### 39. Intro Key Validation Endpoint Has No Brute-Force Controls

**Location:** `src/app/api/intro/validate/route.ts:3-13`

**Problem:** Direct shared-key equality check with no throttling, lockout, or telemetry.

**Impact:** Online brute-force attempts feasible if key quality is weak.

**Fix:** Add rate limiting + attempt caps + logging/alerting.

---

### 40. Client Redirects Trust localStorage Path Values

**Location:**

- `src/app/(auth)/login/_components/login-form.tsx:56-59`
- `src/app/(auth)/login/_components/button-login-google.tsx:49-52`
- `src/app/account/_components/button-back.tsx:13-15`

**Problem:** Navigation uses values from localStorage (`redirect_path_after_login`, `previous_path`) directly.

**Impact:** If client storage is tampered, redirects can be abused for phishing.

**Fix:** Allow only same-origin relative paths; reject external/invalid destinations before redirecting.

---

### 41. MQTT Topic Generation Has No Input Validation

**Location:** `src/utils/mqtt.util.ts:1-8`

**Problem:** `value` parameter is directly substituted into topic string without sanitization.

**Impact:** Currently mitigated by using server-provided `profile.id`. Risk if usage pattern changes.

**Fix:** Add input validation to prevent MQTT wildcard injection.

---

### 42. No Message Origin Verification in MQTT

**Location:** `src/hooks/use-mqtt.ts:17-34`

**Problem:** No verification that messages originate from the expected source.

**Impact:** Low - requires broker compromise. Could lead to fake notifications.

**Fix:** Consider adding message signing/verification or broker ACLs.

---

### 43. No Rate Limiting on MQTT Message Processing

**Location:** `src/components/providers/mqtt-provider/mqtt-provider.tsx`, `src/hooks/use-mqtt.ts`

**Problem:** No bounds on message queue or processing rate.

**Impact:** Memory exhaustion, excessive re-renders, browser tab crashes from malicious server flood.

**Fix:** Add message throttling/throttling.

---

### 44. Protocol-Relative URLs Allowed in Sanitization

**Location:** `src/utils/sanitize.util.ts:238`

**Problem:** `allowProtocolRelative: true` allows URLs like `//google.com`.

**Impact:** Phishing vector in certain contexts.

**Fix:** Set `allowProtocolRelative: false`.

---

### 45. Data URIs Allowed for Images

**Location:** `src/utils/sanitize.util.ts:119`

**Problem:** `img: ['http', 'https', 'data']` allows `data:` URIs for images.

**Impact:** Tracking only, minor exfiltration risk.

**Fix:** Remove `data:` scheme unless explicitly needed.

---

### 46. No Refresh Token Rotation

**Location:** `src/app/api/auth/refresh-token/route.ts:39-40`

**Problem:**

```typescript
const accessToken = res.access_token;
const refreshToken = res.refresh_token; // Same refresh token returned
```

Refresh token not rotated on use.

**Impact:** If token is intercepted, attacker can continue using it for up to 7 days.

**Fix:** Implement refresh token rotation - each refresh should invalidate old refresh token and issue new one.

---

### 47. Search Keyword Displayed Without Encoding

**Location:** `src/app/search/_components/search.tsx:218`

**Problem:**

```tsx
{
  !searchParams.keyword
    ? 'Tìm kiếm phim'
    : `Kết quả tìm kiếm cho "${searchParams.keyword}"`;
}
```

If searchParams.keyword contains quotes or HTML, it could break out of context.

**Impact:** Potential reflected XSS if React doesn't escape properly.

**Fix:** Use text content instead of template literal, or HTML-encode the keyword.

---

### 48. getIdFromSlug Has No Validation

**Location:** `src/utils/url.util.ts:63-65`

**Problem:**

```ts
export const getIdFromSlug = (slug: string) => {
  return slug.split('.')[1];
};
```

If slug doesn't contain `.`, returns `undefined`.

**Impact:** Could cause downstream errors or unexpected behavior.

**Fix:** Add validation that returns empty/null if format is invalid.

---

### 49. MQTT Reconnect Without Exponential Backoff

**Location:** `src/lib/mqtt.ts:12`

**Problem:**

```typescript
reconnectPeriod: 3000,  // Fixed 3-second interval
```

**Impact:** If broker repeatedly fails, fixed reconnect interval could contribute to resource exhaustion.

**Fix:** Implement exponential backoff for reconnection attempts.

---

### 50. OAuth Client-Side Origin Check Only

**Location:** `src/app/(auth)/login/_components/button-login-google.tsx:90`

**Problem:**

```typescript
if (event.origin !== envConfig.NEXT_PUBLIC_GOOGLE_LOGIN_CALLBACK_URL) return; // Client-side only check
```

Origin check relies on browser's `event.origin`. Client-side checks can be bypassed.

**Impact:** CSRF attacks possible if backend doesn't validate origin.

**Fix:** Ensure backend validates origin/CORS headers and implements state parameter.

---

## Positive Security Patterns Found

| Pattern                                   | File                                                                         | Notes                                                                        |
| ----------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| HttpOnly auth cookies                     | `src/app/api/auth/login/route.ts`, `src/app/api/auth/refresh-token/route.ts` | Correct cookie flags include `httpOnly`, `sameSite`                          |
| Non-root runtime container                | `Dockerfile:45-53`                                                           | Container drops root privileges (`USER nextjs`)                              |
| HTML sanitization before dangerous render | `src/utils/sanitize.util.ts`, multiple UI files                              | `sanitize-html` used before `dangerouslySetInnerHTML`                        |
| Centralized env validation                | `src/config.ts`                                                              | Zod validation prevents missing public runtime config                        |
| Comments/reviews use React text content   | `src/components/app/comment/*.tsx`                                           | Auto-escaped, not using dangerouslySetInnerHTML                              |
| MQTT topics use server-provided IDs       | `src/utils/mqtt.util.ts`                                                     | Topics constructed from server-provided profile.id                           |
| Auth forms have strong validation         | `src/schemaValidations/auth.schema.ts`                                       | Password policies robust (min 8, uppercase, lowercase, number, special char) |
| React Hook Form + Zod integration         | Multiple form components                                                     | Provides client-side validation                                              |

---

## Prioritized Remediation Plan

### Phase 1 (Immediate - P0)

- [ ] Remove access token from Zustand/localStorage; use httpOnly cookies only
- [ ] Remove authorization header override in `sendRequest`
- [ ] Remove credentials from source code; use proper secret management
- [ ] Sanitize all error responses before returning to clients
- [ ] Add OAuth state parameter validation
- [ ] Fix IDOR in comment/review delete - backend must validate ownership
- [ ] Fix IDOR in playlist delete/removeItem - backend must validate ownership

### Phase 2 (Soon - P1)

- [ ] Add security headers/CSP in Next.js config
- [ ] Move MQTT credentials to server-only env vars
- [ ] Configure TLS for MQTT connections
- [ ] Pin GitHub Actions to commit SHAs
- [ ] Replace raw `ssh-keyscan` with fingerprint verification
- [ ] Remove client-controlled `id` field from comment/review/playlist schemas
- [ ] Add CSRF token protection for state-changing operations

### Phase 3 (Plan - P2)

- [ ] Implement rate limiting on auth endpoints
- [ ] Fix logout to always clear cookies
- [ ] Remove token from session endpoint response
- [ ] Switch cookie `secure` logic to server-only env signals
- [ ] Harden refresh interceptor queue/failure behavior
- [ ] Disable React Query Devtools in production
- [ ] Remove dangerous tags (`iframe`, `video`, `audio`) from sanitizeText allowedTags
- [ ] Validate VTT URLs from trusted domains only
- [ ] Add input validation for pathParams in http.util.ts

### Phase 4 (Nice to Have - P3)

- [ ] Use `sameSite: 'strict'` for auth cookies
- [ ] Restrict `font-family` regex in sanitizeText
- [ ] Add input validation for email/password format
- [ ] Harden intro key endpoint with rate limiting
- [ ] Validate and sanitize all localStorage-based redirect targets
- [ ] Replace proxy cookie-presence checks with token/session validation
- [ ] Implement refresh token rotation
- [ ] Add exponential backoff for MQTT reconnection

---

## Verification Commands

After implementing fixes:

```bash
# Static checks
yarn lint
yarn build

# Validate response headers
curl -I https://<your-domain>

# Spot-check auth endpoints for token leakage
curl -i https://<your-domain>/api/auth/session

# Dependency audit
yarn audit
```

---

## Notes / Limitations

- Dependency CVE tooling could not be executed in this environment because `pwsh` is unavailable
- This report is based on repository static analysis plus multi-agent review; dependency CVEs should be re-run in CI with `yarn audit`/SCA tooling
- Some findings require backend validation - frontend alone cannot fix IDOR issues
- OAuth and CSRF findings overlap with the previous audit (2026-04-29); severity ratings may differ due to updated context

---

_Audit completed by 5-agent parallel security scan covering Auth/Session, XSS/Injection, API/IDOR, Config/Dependencies, and Video/Third-Party attack vectors._
