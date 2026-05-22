# Security Audit Report

**Generated:** 2026-05-21  
**Scanner:** `.claude/agents/security-vulnerability-scanner.md`  
**Scope:** Full frontend repository static security review covering auth/session, route protection, client rendering/data flow, URL handling, dependencies, Docker/CI, headers, public environment exposure, and MQTT.  
**Method:** 3 parallel security sub-agent scans plus local verification. Restricted files were not read: `supersecrets.txt`, `credentials.json`, `.env`, `.env.local`.

---

## Executive Summary

| Category | Issues Found | Critical | High | Medium | Low |
| -------- | ------------ | -------- | ---- | ------ | --- |
| Total    | 11           | 1        | 5    | 4      | 1   |

## Status Update

**Updated:** 2026-05-22

- Finding 1 is **mitigated in frontend code**. Description and bio fields no longer flow through `dangerouslySetInnerHTML`, and `sanitizeText()` now strips input to plain text before rendering.
- Findings 2 and 3 are **fixed in frontend code**. All JSON-LD script sinks now serialize through a centralized `safeJsonLd()` helper that escapes script-breaking characters before insertion.
- Finding 4 is **mitigated in frontend code**. `/api/auth/session` no longer returns the bearer token, login responses no longer echo token material, and the access token has been removed from Zustand app state.
- `sanitize-html@2.17.0` is still present in the dependency tree, so package replacement/removal remains open under Finding 6.

### Highest-Priority Findings

1. Finding 1 has been mitigated in code, but `sanitize-html@2.17.0` still remains in the dependency tree under Finding 6.
2. Findings 2 and 3 have been fixed in code by escaping JSON-LD before insertion into script tags.
3. Finding 4 has been mitigated by removing the `session` and login response leak path, but full bearer confinement still requires a server-proxy architecture for authenticated client traffic.
4. `NEXT_PUBLIC_MQTT_USERNAME` and `NEXT_PUBLIC_MQTT_PASSWORD` are bundled into the client.
5. Production dependency audit reported `29` vulnerabilities: `2 Critical`, `10 High`, `16 Moderate`, `1 Low`.

---

## Critical Vulnerabilities

### 1. Sanitizer Bypass Can Lead to XSS

**Severity:** Critical  
**Type:** CWE-79, Cross-Site Scripting  
**OWASP:** A03:2021 - Injection  
**Locations:** `package.json:67`, `yarn.lock`, `src/utils/sanitize.util.ts:17`, example sink `src/app/(home)/_components/slider/slider-item.tsx:181`

**Status:** Mitigated on 2026-05-22. The exploit path in the frontend was removed by converting `sanitizeText()` to plain-text sanitization and replacing description/bio `dangerouslySetInnerHTML` sinks with normal React text rendering in:

- `src/app/(home)/_components/slider/slider-item.tsx`
- `src/components/app/collection/anime-item.tsx`
- `src/components/app/watch/watch-info.tsx`
- `src/components/app/movie-side/movie-side.tsx`
- `src/app/person/[id]/_components/person-sidebar.tsx`

**Residual Risk:** The vulnerable `sanitize-html@2.17.0` dependency is still installed. That package risk remains tracked under Finding 6 until it is replaced or removed.

**Evidence:**

`package.json` declares `sanitize-html` and `yarn.lock` resolves `sanitize-html@2.17.0`. `sanitizeText()` output is rendered through `dangerouslySetInnerHTML` in several UI paths.

```tsx
dangerouslySetInnerHTML={{
  __html: sanitizeText(slider.movie.description)
}}
```

**Impact:** Before the fix, attacker-controlled description or bio HTML could survive sanitization and execute in user browsers through `dangerouslySetInnerHTML`. That direct rendering path is now removed.

**Remediation:** Done for the frontend sink path by switching these fields to plain-text rendering. Remaining follow-up is to replace/remove `sanitize-html` so the vulnerable package is no longer shipped.

**Effort:** Moderate

---

## High Vulnerabilities

### [FIXED] 2. JSON-LD Script Injection via Raw `JSON.stringify()`

**Severity:** High  
**Type:** CWE-79 / CWE-116, Stored or Reflected XSS  
**OWASP:** A03:2021 - Injection  
**Locations:** `src/components/seo/json-ld.tsx:9`, `src/app/movie/[slug]/page.tsx:224`, `src/app/watch/[slug]/page.tsx:188`, `src/app/person/[id]/page.tsx:113`

**Status:** Fixed on 2026-05-22. JSON-LD serialization was centralized into `src/components/seo/json-ld.util.ts`, and `JsonLd` now renders `safeJsonLd(data)` instead of raw `JSON.stringify(data)`.

**Fix Details:** `safeJsonLd()` escapes `<`, `>`, `&`, U+2028, and U+2029 after `JSON.stringify()`, which prevents `</script>` breakout and other script-context injection when backend-controlled fields are embedded into JSON-LD.

**Evidence:**

```tsx
<script
  type='application/ld+json'
  dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
/>
```

**Impact:** Before the fix, backend-controlled fields such as `movie.title`, `movie.description`, `person.name`, or `person.bio` could terminate the JSON-LD script and execute attacker JavaScript. That script-breakout path is now closed by escaped serialization.

**Remediation:** Done. `JsonLd` now uses a centralized `safeJsonLd(data)` helper for script-safe JSON serialization.

**Effort:** Quick

### [FIXED] 3. Breadcrumb and ItemList JSON-LD Use the Same Unsafe Script Sink

**Severity:** High  
**Type:** CWE-79 / CWE-116, Stored or Reflected XSS  
**OWASP:** A03:2021 - Injection  
**Locations:** `src/components/seo/breadcrumb-list-json-ld.tsx:25`, `src/components/seo/breadcrumb-list-json-ld.tsx:60`

**Status:** Fixed on 2026-05-22. `BreadcrumbListJsonLd` and `ItemListJsonLd` now use the same centralized `safeJsonLd(data)` helper as `JsonLd`.

**Fix Details:** The fix covers breadcrumb and item-list inputs such as `movie.title`, `categoryName`, `countryName`, and `topicName` by escaping script-breaking characters before the JSON-LD payload is written into the `<script type="application/ld+json">` sink.

**Evidence:**

```tsx
dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
```

Inputs include `movie.title`, `categoryName`, `countryName`, and `topicName` from category, country, and topic pages.

**Impact:** Before the fix, malicious titles or names could break out of the JSON-LD script and run JavaScript on SEO-rendered pages. That shared sink is now protected by the same escaping helper used for Finding 2.

**Remediation:** Done. `BreadcrumbListJsonLd` and `ItemListJsonLd` now reuse the same `safeJsonLd(data)` helper from Finding 2.

**Effort:** Quick

### [MITIGATED] 4. HttpOnly Access Token Is Exposed Back to JavaScript

**Severity:** High  
**Type:** CWE-200 / CWE-922, Sensitive Information Exposure  
**OWASP:** A02:2021 - Cryptographic Failures, A07:2021 - Identification and Authentication Failures  
**Locations:** `src/app/api/auth/session/route.ts:13`, `src/app/api/auth/session/route.ts:25`, `src/components/providers/app-provider/app-provider.tsx:55`

**Status:** Mitigated on 2026-05-22. `/api/auth/session` now returns only safe session metadata (`authenticated`, `csrfToken`, `profile`) instead of bearer token material. Client login/google-login flows no longer read token material from internal auth responses, and the access token has been removed from Zustand app state.

**Fix Details:** Auth bootstrapping is now driven by the server-side session/profile response rather than copying the bearer token into client state on startup. The client bearer is now kept in the HTTP module only when a protected request has to rehydrate through the refresh flow, which reduces broad token exposure across app code and state tooling.

**Residual Risk:** This is not a full architectural closure. The frontend still performs direct authenticated API/media requests, so the refresh flow can still reintroduce a bearer token into browser JavaScript when protected client traffic needs to recover auth. Fully keeping bearer tokens server-only requires moving authenticated API/media access behind same-origin server routes or another backend-for-frontend/session-proxy pattern.

**Evidence:**

```ts
const accessToken = await getCookie(storageKeys.ACCESS_TOKEN);

return NextResponse.json({
  result: true,
  data: {
    accessToken,
    csrfToken
  }
});
```

```ts
setAccessToken(session.accessToken);
setCsrfToken(session.csrfToken);
```

**Impact:** Before the mitigation, `/api/auth/session` returned the access token to browser JavaScript and `AppProvider` copied it into Zustand. That direct session bootstrap leak path is now removed.

**Remediation:** Partially done. `/api/auth/session` now returns safe metadata only, and startup auth state no longer depends on copying the bearer into client state. Remaining work for a full fix is to proxy authenticated API/media traffic through internal server routes so refresh never has to return a bearer token to browser JavaScript.

**Effort:** Moderate

### 5. Public MQTT Credentials Are Shipped to the Browser

**Severity:** High  
**Type:** CWE-798 / CWE-200, Exposed Credentials  
**OWASP:** A07:2021 - Identification and Authentication Failures, A05:2021 - Security Misconfiguration  
**Locations:** `src/config.ts:13`, `src/lib/mqtt.ts:13`, `Dockerfile:26`, `.github/workflows/docker.yml:40`

**Evidence:**

```ts
client = mqtt.connect(envConfig.NEXT_PUBLIC_MQTT_BROKER as string, {
  username: envConfig.NEXT_PUBLIC_MQTT_USERNAME as string,
  password: envConfig.NEXT_PUBLIC_MQTT_PASSWORD as string
});
```

**Impact:** Anything prefixed `NEXT_PUBLIC_` is client-exposed. Any user can extract broker username/password from shipped JavaScript or runtime config, then connect directly to MQTT unless broker ACLs fully constrain the account.

**Remediation:** Treat browser MQTT credentials as public. Use per-user short-lived broker tokens from a server endpoint, enforce broker ACLs scoped to user/topic, or move privileged MQTT interactions server-side. Do not pass MQTT passwords as Docker build args.

**Effort:** Moderate to Extensive

### 6. Vulnerable Production Dependencies

**Severity:** High  
**Type:** CWE-1104, Use of Vulnerable Components  
**OWASP:** A06:2021 - Vulnerable and Outdated Components  
**Locations:** `package.json:39`, `package.json:53`, `package.json:67`, `yarn.lock`

**Evidence:** `yarn audit --groups dependencies` reported `29` vulnerabilities: `2 Critical`, `10 High`, `16 Moderate`, `1 Low`.

Most actionable packages from the audit output:

| Package                        | Current     | Reported Issue                                              | Patched / Action                         |
| ------------------------------ | ----------- | ----------------------------------------------------------- | ---------------------------------------- |
| `axios`                        | `1.13.2`    | SSRF/proxy bypass and prototype-pollution gadget advisories | Upgrade to `>=1.15.x` per audit          |
| `sanitize-html`                | `2.17.0`    | Critical XSS advisory                                       | No patch reported; mitigate or replace   |
| `mqtt > ws`                    | `ws@8.20.0` | Uninitialized memory disclosure                             | Upgrade/override to `ws >=8.20.1`        |
| `next/sanitize-html > postcss` | mixed       | XSS in CSS stringify output                                 | Pull `postcss >=8.5.10` where possible   |
| `rimraf > glob > minimatch`    | transitive  | ReDoS advisories                                            | Pull `minimatch >=10.2.3` where possible |

**Impact:** Exploitability varies by package and code path. The sanitizer issue is directly relevant because sanitized HTML is rendered. Axios and WebSocket dependencies affect API and MQTT request paths.

**Remediation:** Upgrade direct dependencies where possible, add Yarn resolutions for vulnerable transitives where safe, and re-run `yarn audit --groups dependencies`.

**Effort:** Moderate

---

## Medium Vulnerabilities

### 7. Route Protection Trusts Cookie Presence Without Token Validation

**Severity:** Medium  
**Type:** CWE-287 / CWE-306, Improper Authentication  
**OWASP:** A01:2021 - Broken Access Control, A07:2021 - Identification and Authentication Failures  
**Location:** `src/proxy.ts:16`

**Evidence:**

```ts
const accessToken = request.cookies.get(storageKeys.ACCESS_TOKEN)?.value;

if (privatePaths.some((p) => pathname.startsWith(p))) {
  if (!accessToken) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }
}
```

**Impact:** Any non-empty `access_token` cookie passes route protection for `/account`, `/survey`, and `/user`, even if expired, malformed, revoked, or attacker-injected. Backend APIs may still reject the token, but protected page shells and client logic can be reached.

**Remediation:** Validate token shape and expiry before allowing protected routes, or use an internal session validation endpoint / signed session cookie. Consider `__Host-` cookie names to reduce cookie injection risk.

**Effort:** Moderate

### 8. Missing Content Security Policy

**Severity:** Medium  
**Type:** CWE-693, Security Misconfiguration  
**OWASP:** A05:2021 - Security Misconfiguration  
**Location:** `next.config.ts:47`

**Evidence:** Headers include `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and HSTS, but no `Content-Security-Policy`.

**Impact:** Existing `dangerouslySetInnerHTML` usage means any sanitizer bypass or upstream HTML compromise has no CSP backstop to limit script execution, external connections, frames, or media origins.

**Remediation:** Add CSP in `headers()` with constrained `default-src`, `script-src`, `style-src`, `img-src`, `connect-src`, `media-src`, and `frame-ancestors`. Include only required origins: app host, API/auth/media hosts, MQTT broker websocket origin, and trusted video/embed hosts.

**Effort:** Moderate

### 9. Unencoded Route Path Parameter Substitution

**Severity:** Medium  
**Type:** CWE-116 / CWE-20, Improper Encoding and Input Validation  
**OWASP:** A04:2021 - Insecure Design, A03:2021 - Injection  
**Locations:** `src/utils/http.util.ts:194`, `src/utils/url.util.ts:63`, `src/app/movie/[slug]/page.tsx:59`

**Evidence:**

```ts
Object.entries(pathParams).forEach(([key, value]) => {
  baseUrl = baseUrl.replace(`:${key}`, value.toString());
});
```

**Impact:** A crafted slug segment containing decoded reserved URL characters like `?`, `#`, or `/` can alter the outgoing API URL path/query. This is not an IDOR by itself, but it weakens URL handling and can create request confusion.

**Remediation:** Replace path params with `encodeURIComponent(String(value))` and validate slug IDs against the expected ID format before API calls.

**Effort:** Quick

### 10. Excessive Data Exposure in Favourite List API Contract

**Severity:** Medium  
**Type:** CWE-200, Excessive Data Exposure  
**OWASP:** A01:2021 - Broken Access Control, A04:2021 - Insecure Design  
**Locations:** `src/api-requests/favourite.api-request.ts:16`, `src/types/favourite.type.ts:7`, `src/types/favourite.type.ts:46`, `src/app/user/favourite/_components/favourite-list.tsx:29`

**Evidence:** `FavouriteResType` includes `user: UserResType`, and `UserResType` includes fields such as `email`, `phone`, `group`, and `permissions`. The UI only maps `favourite.movie` and `favourite.person`.

**Impact:** Sensitive user/account metadata is delivered to the browser unnecessarily, increasing exposure through DevTools, logs, extensions, or compromised client state.

**Remediation:** Return a DTO for favourite lists containing only `id`, `type`, `movie`/`person`, and pagination fields. Remove `user` from the frontend list response type if the UI does not need it.

**Effort:** Moderate

---

## Low Vulnerabilities

### 11. Internal Auth Mutation Routes Do Not Enforce CSRF Validation

**Severity:** Low  
**Type:** CWE-352, Cross-Site Request Forgery  
**OWASP:** A01:2021 - Broken Access Control, A07:2021 - Identification and Authentication Failures  
**Locations:** `src/app/api/auth/logout/route.ts:8`, `src/app/api/auth/refresh-token/route.ts:17`

**Evidence:** The CSRF cookie is created in login/refresh/session, but internal auth POST routes do not compare `X-CSRF-Token` against the cookie.

```ts
export async function POST() {
  const refresh_token = await getCookie(storageKeys.REFRESH_TOKEN);
  // ...
}
```

**Impact:** `SameSite: 'lax'` reduces most cross-site POST cookie sending, so exploitability is limited. Still, logout CSRF or forced refresh behavior can be possible in browser edge cases, same-site subdomain scenarios, or if cookie policy changes.

**Remediation:** Require `X-CSRF-Token` for internal auth mutation routes and compare it with the server-side CSRF cookie using a constant-time comparison. Mark corresponding internal auth API config as CSRF-required.

**Effort:** Quick

---

## Positive Security Patterns Found

| Pattern                                   | File                                                       | Notes                                                                                |
| ----------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| HttpOnly cookie options exist             | `src/app/api/auth/_lib/make-cookie-option.ts`              | Cookies use `httpOnly`, `sameSite: 'lax'`, `path: '/'`, and production-only `secure` |
| Baseline security headers exist           | `next.config.ts`                                           | HSTS, frame denial, MIME sniffing protection, and referrer policy are configured     |
| Container drops root privileges           | `Dockerfile`                                               | Runtime stage uses non-root `nextjs` user                                            |
| Google message receiver checks origin     | `src/app/(auth)/login/_components/button-login-google.tsx` | `event.origin` is checked before accepting callback code                             |
| Route protection exists for private pages | `src/proxy.ts`                                             | `/account`, `/survey`, and `/user` are gated by auth cookie presence                 |

---

## False Positives / Not Confirmed

- No verified open redirect was found in the reviewed login redirect flow. The stored redirect path is set from `window.location.pathname`, not a query-controlled external URL.
- No frontend-confirmed IDOR was found in the reviewed paths. Backend authorization still needs to enforce ownership.
- No hardcoded plaintext secrets were found in allowed files beyond the public MQTT credential exposure pattern.
- Restricted files were intentionally excluded from review.

---

## Prioritized Remediation Plan

### Phase 1 - Immediate

- [x] Escape JSON-LD serialization before inserting it into `<script type="application/ld+json">`.
- [x] Stop returning `accessToken` from `/api/auth/session` and remove token copying into Zustand.
- [ ] Move authenticated client API/media traffic behind same-origin server routes so refresh never has to reintroduce bearer tokens to browser JavaScript.
- [x] Remove HTML rendering from description/bio sinks and reduce `sanitizeText()` to plain-text sanitization.
- [ ] Replace/remove `sanitize-html` and add XSS regression coverage for malicious description/bio payloads.
- [ ] Upgrade vulnerable runtime dependencies where possible and refresh `yarn.lock`.

### Phase 2 - Soon

- [ ] Replace public static MQTT credentials with short-lived per-user broker credentials and strict ACLs.
- [ ] Add a Content Security Policy.
- [ ] Validate auth cookies in `src/proxy.ts`, at least checking token expiry/shape.
- [ ] Encode path parameter substitutions and validate route-derived IDs.
- [ ] Reduce favourite list DTOs to only the fields needed by the UI.

### Phase 3 - Hardening

- [ ] Add CSRF token/origin validation for internal auth mutation routes.
- [ ] Add `Permissions-Policy`, `Cross-Origin-Opener-Policy`, and `Cross-Origin-Resource-Policy` where compatible.
- [ ] Re-run dependency audit in CI and fail on high/critical production vulnerabilities.

---

## Verification Commands

```bash
yarn lint
yarn build
yarn audit --groups dependencies
```

Additional manual checks after fixes:

```bash
curl -i https://<your-domain>/api/auth/session
curl -I https://<your-domain>
```

Expected outcomes:

- `/api/auth/session` must not return raw token material.
- Response headers should include CSP and other browser hardening policies.
- Dependency audit should no longer report the listed runtime advisories.

---

## Notes / Limitations

- This is a frontend/static review. Backend authorization and DTO fixes require backend enforcement to fully resolve some findings.
- Dependency findings reflect `yarn audit --groups dependencies` output observed during this scan on 2026-05-21.
- Restricted secret files were intentionally excluded from review.
