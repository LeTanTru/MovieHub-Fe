# Security Audit Report

**Generated:** 2026-05-30  
**Scope:** Static security review of the Next.js/React frontend repository, including route handlers, auth/session flow, browser trust boundaries, rendering sinks, security headers, Docker, and GitHub Actions deployment.  
**Guidance Used:** `.agents/skills/security-best-practices/SKILL.md`, relevant Next.js/React/browser security references under `.agents/skills/security-best-practices/references/`, and `.claude/agents/security-vulnerability-scanner.md`.  
**Restricted Files Not Read:** `supersecrets.txt`, `credentials.json`, `.env`, `.env.local`.

---

## Executive Summary

| Category | Issues Found | Critical | High | Medium | Low |
| -------- | ------------ | -------- | ---- | ------ | --- |
| Total    | 8            | 0        | 4    | 4      | 0   |

### Highest-Priority Findings

1. Browser JavaScript still receives bearer token material from login, refresh, and session endpoints.
2. Cookie-backed auth endpoints mutate session state without visible Origin/Referer or CSRF enforcement.
3. MQTT credentials are intentionally exposed through `NEXT_PUBLIC_*` values and used directly in the browser.
4. The intended intro access gate is not enforced and can be bypassed client-side.

### Positive Notes

- The previous post-login redirect finding appears remediated. `getSafeRedirectPath()` now rejects non-relative, protocol-relative, and cross-origin redirect values before assigning `window.location.href`.
- The previous deploy host-key finding has been remediated. `.github/workflows/docker.yml` now writes a pinned `VPS_KNOWN_HOSTS` secret to `~/.ssh/known_hosts` instead of using `ssh-keyscan`.
- Reviewed rich HTML rendering paths pass API content through `sanitizeText()` or `safeJsonLd()` before `dangerouslySetInnerHTML`; no confirmed active XSS sink was found in this pass.
- `git ls-files` shows `.env`, `.env.local`, `supersecrets.txt`, and `credentials.json` are not tracked.

---

## High Vulnerabilities

### 1. Auth Token Boundary Is Broken Across Login, Refresh, and Session Bootstrap

**Severity:** High  
**Vulnerability Type:** Sensitive token exposure, CWE-200 / CWE-922  
**OWASP Category:** A02:2021 - Cryptographic Failures, A07:2021 - Identification and Authentication Failures  
**Location:** `src/app/api/auth/login/route.ts:47-74`, `src/app/api/auth/login/google/route.ts:24-65`, `src/app/api/auth/refresh-token/route.ts:18-20`, `src/app/api/auth/session/route.ts:67-75`, `src/utils/http.util.ts:57-66`, `src/components/providers/app-provider/app-provider.tsx:65-75`

**Evidence:**

```ts
return NextResponse.json({ result: true, data: res });
```

```ts
return NextResponse.json(
  { result: true, data: { ...res, profile } },
  { status: HttpStatusCode.Ok }
);
```

```ts
data: {
  accessToken,
  userKind: userKind !== null ? Number(userKind) : null,
  csrfToken
}
```

```ts
const newAccessToken = data.data.access_token;
useAuthStore.getState().setAccessToken(newAccessToken);
```

**Impact Analysis:** The app sets `HttpOnly` auth cookies, but then returns `access_token`, `refresh_token`, and refreshed token data to browser JavaScript. Any same-origin XSS, compromised dependency, or malicious browser extension can read or replay bearer tokens, largely defeating the intended cookie boundary.

**Remediation:** Keep `access_token` and `refresh_token` server-confined. Do not return bearer tokens from `/api/auth/login`, `/api/auth/login/google`, `/api/auth/refresh-token`, or `/api/auth/session`. Return only non-sensitive session metadata. If the frontend needs authenticated API access, proxy those calls through same-origin server route handlers or a backend-for-frontend that reads `HttpOnly` cookies server-side.

**Effort to Fix:** Extensive

---

### 2. Cookie-Authenticated Auth Routes Lack Visible CSRF or Origin Enforcement

**Severity:** High  
**Vulnerability Type:** Cross-Site Request Forgery, CWE-352  
**OWASP Category:** A01:2021 - Broken Access Control, A05:2021 - Security Misconfiguration  
**Location:** `src/app/api/auth/login/route.ts:18-20`, `src/app/api/auth/login/google/route.ts:17-20`, `src/app/api/auth/refresh-token/route.ts:7-20`, `src/app/api/auth/logout/route.ts:8-20`, `src/app/api/auth/_lib/make-cookie-option.ts:8-10`

**Evidence:**

```ts
export async function POST(request: NextRequest) {
  const body = await request.json();
```

```ts
export async function POST() {
  const refreshedSession = await refreshSession();
```

```ts
httpOnly: true,
sameSite: 'lax',
secure: envConfig.NEXT_PUBLIC_NODE_ENV !== 'development',
```

No reviewed auth route validates `Origin`, `Referer`, or a submitted CSRF token before mutating auth cookies/session state.

**Impact Analysis:** Cross-site requests can hit login, refresh, and logout flows that create, rotate, or remove cookie-backed session state. `SameSite=Lax` is useful defense-in-depth, but it should not be the only control for state-changing auth endpoints.

**Remediation:** Add a shared guard for state-changing internal auth routes that validates `Origin` or `Referer` against `NEXT_PUBLIC_URL`. For routes that depend on an existing cookie-authenticated session, also validate a CSRF token header/body value against a server-readable token.

**Effort to Fix:** Moderate

---

### 3. Public MQTT Credentials Are Embedded in the Browser Build

**Severity:** High  
**Vulnerability Type:** Exposed credentials, CWE-798 / CWE-200  
**OWASP Category:** A05:2021 - Security Misconfiguration, A07:2021 - Identification and Authentication Failures  
**Location:** `src/config.ts:13-15`, `src/lib/mqtt.ts:13-19`, `Dockerfile:26-40`, `.github/workflows/docker.yml:31-42`, `.github/workflows/docker.yml:94-96`

**Evidence:**

```ts
NEXT_PUBLIC_MQTT_BROKER: z.string(),
NEXT_PUBLIC_MQTT_USERNAME: z.string(),
NEXT_PUBLIC_MQTT_PASSWORD: z.string()
```

```ts
client = mqtt.connect(envConfig.NEXT_PUBLIC_MQTT_BROKER as string, {
  username: envConfig.NEXT_PUBLIC_MQTT_USERNAME as string,
  password: envConfig.NEXT_PUBLIC_MQTT_PASSWORD as string,
```

**Impact Analysis:** `NEXT_PUBLIC_*` values are bundled for the browser and must be treated as public. Any user can extract these MQTT credentials and connect directly to the broker. If broker ACLs are broad, this can allow unauthorized topic reads, spoofed messages, notification abuse, or cross-user data exposure.

**Remediation:** Replace static public MQTT credentials with short-lived scoped tokens minted server-side, strict per-user topic ACLs, or a server-side broker bridge for privileged topics. Rotate the current broker credentials after deploying a safer design.

**Effort to Fix:** Moderate to Extensive

---

### 4. Intro Access Gate Is Client-Side and Currently Not Enforced

**Severity:** High  
**Vulnerability Type:** Broken access control, CWE-284 / CWE-306  
**OWASP Category:** A01:2021 - Broken Access Control  
**Location:** `src/components/providers/app-provider/app-provider.tsx:90-97`, `src/components/providers/app-provider/app-provider.tsx:118-135`, `src/app/(auth)/intro/_components/intro-form.tsx:32-38`, `src/app/api/intro/validate/route.ts:3-13`

**Evidence:**

```ts
// useEffect(() => {
//   if (pathname !== '/intro') {
//     const hasValidAccess = checkAccessExpiry();
//     if (!hasValidAccess) {
//       navigate.replace('/intro');
//     }
//   }
// }, [pathname, navigate]);
```

```ts
setData('intro_access_granted', 'true');
setData('intro_access_expiry', expiryDate.toISOString());
window.location.href = '/';
```

```ts
if (key === process.env.ACCESS_KEY) {
  return Response.json({ valid: true }, { status: HttpStatusCode.Ok });
}
```

**Impact Analysis:** The access check is commented out, and the proof of access is only `localStorage`. Users can reach the app without passing `/intro`, or manually set `intro_access_granted` and `intro_access_expiry` if the client check is re-enabled. If the intro key is intended to restrict public access, it is not an effective security boundary.

**Remediation:** Enforce intro access server-side in `src/proxy.ts` or remove the feature if it is only cosmetic. Store an `HttpOnly`, signed, expiring cookie after successful validation, and check that cookie in proxy/server code before allowing protected routes.

**Effort to Fix:** Moderate

---

## Medium Vulnerabilities

### 5. Missing Content Security Policy

**Severity:** Medium  
**Vulnerability Type:** Protection mechanism failure, CWE-693  
**OWASP Category:** A05:2021 - Security Misconfiguration  
**Location:** `next.config.ts:47-79`

**Evidence:**

```ts
headers: [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Robots-Tag', value: 'index, follow' }
];
```

No `Content-Security-Policy` header is configured in visible app code.

**Impact Analysis:** If an XSS sink is introduced or reached through user-generated content, the browser has no CSP-level containment for script execution or data exfiltration. This matters more because the app currently exposes bearer tokens to browser JavaScript.

**Remediation:** Add a production CSP in `next.config.ts` or edge configuration. Start with constrained `default-src`, `script-src`, `style-src`, `img-src`, `connect-src`, `media-src`, and `frame-ancestors` directives that include the API, media, Google login, and MQTT/WebSocket origins actually required by the app.

**Effort to Fix:** Moderate

---

### 6. Rich HTML Sanitizer Policy Is Broader Than Needed

**Severity:** Medium  
**Vulnerability Type:** XSS defense-in-depth weakness, CWE-79 / CWE-693  
**OWASP Category:** A03:2021 - Injection, A05:2021 - Security Misconfiguration  
**Location:** `src/utils/sanitize.util.ts:17-241`, `src/app/(home)/_components/slider/slider-item.tsx:179-184`, `src/components/app/collection/anime-item.tsx:153-158`, `src/app/person/[id]/_components/person-sidebar.tsx:58-170`, `src/components/app/watch/watch-info.tsx:163`, `src/components/app/movie-side/movie-side.tsx:127`

**Evidence:**

```ts
allowedAttributes: {
  '*': ['class', 'id', 'style'],
  a: ['href', 'target', 'rel', 'title'],
  img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'srcset', 'sizes'],
  iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen', 'allow', 'title']
}
```

```ts
allowedSchemes: ['http', 'https', 'mailto', 'tel', 'data'],
allowProtocolRelative: true,
```

```tsx
dangerouslySetInnerHTML={{
  __html: sanitizeText(slider.movie.description)
}}
```

**Impact Analysis:** No active XSS exploit path was confirmed during this pass: obvious payloads such as event handlers and `javascript:` links are stripped by `sanitize-html`, and JSON-LD output is escaped by `safeJsonLd()`. However, the shared rich-text policy allows more browser-interpreted surface than movie descriptions and bios appear to require, including global inline styles, `data:` URLs, protocol-relative URLs, media tags, and iframes. If sanitizer behavior changes, a browser-specific parsing edge case is found, or a future component reuses `sanitizeText()` in a riskier context, this broad policy increases XSS blast radius.

**Remediation:** Tighten `sanitizeText()` to the minimum formatting needed for descriptions and bios. Remove global `style` unless there is a strong product requirement, remove `data:` from `allowedSchemes` and image schemes unless inline images are required, set `allowProtocolRelative: false`, and split iframe/media support into a separate explicitly named sanitizer for trusted embed content.

**Effort to Fix:** Quick to Moderate

---

### 7. Route Protection Trusts Cookie Presence More Than Session Validity

**Severity:** Medium  
**Vulnerability Type:** Improper authentication, CWE-287 / CWE-306  
**OWASP Category:** A01:2021 - Broken Access Control, A07:2021 - Identification and Authentication Failures  
**Location:** `src/proxy.ts:15-35`, `src/app/api/auth/session/route.ts:23-55`, `src/components/providers/app-provider/app-provider.tsx:65-75`

**Evidence:**

```ts
const accessToken = request.cookies.get(storageKeys.ACCESS_TOKEN)?.value;
const refreshToken = request.cookies.get(storageKeys.REFRESH_TOKEN)?.value;
```

```ts
if (accessToken && isAuthPath) {
  return NextResponse.redirect(new URL(route.home.path, request.nextUrl));
}
else if (!refreshToken) {
  if (isPrivatePath) {
    const loginUrl = new URL(route.login.path, request.nextUrl);
```

**Impact Analysis:** Private route access is based on cookie presence, not validated session state. Expired, malformed, or revoked cookies can still pass the proxy check until deeper API calls fail, and auth pages can redirect users away based on a stale access-token cookie.

**Remediation:** Validate session state before granting protected routes, or use a server-readable signed session cookie whose validity can be checked cheaply in proxy. Clear stale auth cookies aggressively when session refresh fails.

**Effort to Fix:** Moderate

---

### 8. Intro Key Validation Has No Visible Rate Limiting or Abuse Controls

**Severity:** Medium  
**Vulnerability Type:** Missing rate limiting / brute-force protection, CWE-307 / CWE-770  
**OWASP Category:** A07:2021 - Identification and Authentication Failures, API4:2023 - Unrestricted Resource Consumption  
**Location:** `src/app/api/intro/validate/route.ts:3-13`

**Evidence:**

```ts
export async function POST(request: Request) {
  const { key } = await request.json();

  if (key === process.env.ACCESS_KEY) {
    return Response.json({ valid: true }, { status: HttpStatusCode.Ok });
  }
```

**Impact Analysis:** The public validation endpoint compares a submitted key to a server-side secret and returns success/failure without visible throttling, lockout, or request-size control. An attacker can brute-force weak keys or generate repeated load against the endpoint.

**Remediation:** Add rate limiting per IP and per key attempt, enforce a small JSON body size, use a high-entropy key, and return generic responses with consistent timing where practical. If this gate protects real access, prefer signed expiring cookies plus proxy enforcement as described in finding 4.

**Effort to Fix:** Quick to Moderate

---

## Reviewed Areas Without Confirmed Findings

- **Open redirect:** `src/utils/url.util.ts:82-98` validates redirect paths with same-origin checks. Login and Google login use it before navigation.
- **Active XSS sinks:** Searches for `dangerouslySetInnerHTML`, raw DOM HTML APIs, `document.write`, `eval`, `new Function`, `javascript:` literals, `postMessage`, and navigation sinks did not identify a confirmed untrusted-input-to-script-execution path. The sanitizer policy is still tracked as a medium defense-in-depth issue above.
- **PostMessage:** Google callback uses an explicit `targetOrigin`, and the opener listener checks `event.origin` against `NEXT_PUBLIC_GOOGLE_LOGIN_CALLBACK_URL`. Payload shape validation could be stricter, but no direct dangerous sink was found.
- **Secrets in git:** `git ls-files .env .env.local supersecrets.txt credentials.json` returned no tracked restricted files.
- **Docker runtime:** The container uses production `NODE_ENV`, a non-root `nextjs` user, and `node server.js` rather than `next dev`.

---

## Dependency Audit Status

Dependency vulnerability counts were not verified in this run.

Attempted command on **2026-05-30**:

```bash
yarn audit --groups dependencies
```

Sandboxed result:

```text
info There appears to be trouble with your network connection. Retrying...
error Couldn't find package "tslib@^2.8.0" required by "@swc/helpers@0.5.15" on the "npm" registry.
```

I then requested escalated network access for the same command, but the request was interrupted by the user, so no current advisory list is included. Re-run `yarn audit --groups dependencies` or equivalent CI dependency scanning from a network path that can reach the registry before treating dependency risk as cleared.

---

## Recommended Remediation Order

1. Stop returning `access_token` and `refresh_token` to browser JavaScript from login, Google login, refresh, and session endpoints.
2. Add Origin/Referer and CSRF validation to state-changing internal auth routes.
3. Remove static MQTT credentials from the public client trust model and rotate existing broker credentials.
4. Decide whether `/intro` is a real access boundary; if yes, enforce it server-side with a signed `HttpOnly` cookie.
5. Add a production CSP.
6. Tighten the rich HTML sanitizer policy used by `sanitizeText()`.
7. Tighten route protection around validated session state.
8. Add rate limiting to `/api/intro/validate`.
