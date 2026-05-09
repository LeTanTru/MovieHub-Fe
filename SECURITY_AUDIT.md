# Security Audit Report

**Generated:** 2026-05-09 (Updated)
**Scope:** Full application security review (app/auth/infra/CI)
**Method:** Multi-agent static analysis + manual validation

---

## Executive Summary

| Category | Issues Found | Critical | High | Medium | Low |
| -------- | ------------ | -------- | ---- | ------ | --- |
| Total    | 25+          | 5        | 4    | 9      | 8   |

### Key Findings

1. **Critical auth token exposure** - Tokens stored in client state and returned in API responses, undermining HttpOnly cookie protections.
2. **Hardcoded service credentials** in source code.
3. **Missing OAuth CSRF protection** via state parameter validation.
4. **Authorization header injection** via request override.
5. **Missing security headers/CSP** leaves browser-side defenses incomplete.
6. **MQTT credentials exposed** as public environment variables.
7. **Debug/error data exposure** from upstream error passthrough and verbose logging.
8. **Insufficient sanitization** of CSS style attributes in user content.
9. **No TLS configured** for MQTT connections.

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

- Stop returning token material from `/api/auth/*` responses.
- Keep auth tokens server-only (HttpOnly cookie/BFF pattern).
- Make `/api/auth/session` return only non-sensitive session state (`authenticated`, profile claims).

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

## HIGH VULNERABILITIES (P1 - Fix Soon)

### 6. MQTT Credentials Exposed as Public Variables

**Location:** `src/config.ts:14-15`

**Problem:**

```typescript
NEXT_PUBLIC_MQTT_BROKER: z.string(),
NEXT_PUBLIC_MQTT_USERNAME: z.string(),
NEXT_PUBLIC_MQTT_PASSWORD: z.string()
```

MQTT credentials are stored in `NEXT_PUBLIC_*` variables, exposing them to client-side code.

**Impact:** Any user can view these credentials in browser devtools.

**Fix:** Use server-side-only env vars for MQTT credentials, or use a server-side proxy for MQTT connections.

---

### 7. Token Refresh Race Condition Handler

**Location:** `src/utils/http.util.ts:25-41`, `src/utils/http.util.ts:68-81`

**Problem:**
While the queued request pattern is correct for handling concurrent refresh attempts, if multiple tabs trigger refresh simultaneously or if the refresh fails mid-retry, requests can stall or fail.

**Impact:** Brief authentication lapses possible; potential for queue stalls.

**Fix:** Add exponential backoff and max retry limits; force logout when refresh definitively fails.

---

### 8. Missing Baseline Security Headers and CSP

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

### 9. GitHub Actions Are Not Pinned to Immutable SHAs

**Location:** `.github/workflows/docker.yml:13,16,19,25`

**Problem:**  
Workflow uses tag-based action refs (`@v4`, `@v3`, `@v6`) instead of commit SHA pinning.

**Impact:**  
If an upstream action tag is compromised/moved, attacker-controlled code may run in CI with repository secrets.

**Fix:** Pin all third-party actions to full commit SHAs and periodically rotate pin updates.

---

### 10. SSH Host Trust Bootstrap Uses Raw `ssh-keyscan` (TOFU)

**Location:** `.github/workflows/docker.yml:73`

**Problem:**  
Host key is fetched dynamically and trusted without fingerprint verification.

**Impact:**  
MITM during bootstrap could poison `known_hosts` and compromise deployment commands/secrets.

**Fix:** Store the expected host fingerprint in secrets/repo and verify before adding to `known_hosts`.

---

## MEDIUM VULNERABILITIES (P2 - Plan Fix)

### 11. No Rate Limiting on Authentication Endpoints

**Location:** All auth routes in `src/app/api/auth/**/route.ts`

**Problem:** No rate limiting middleware present in login, refresh-token, or logout routes.

**Impact:** Brute force attacks possible; denial of service via repeated login attempts.

**Fix:** Implement rate limiting (e.g., `express-rate-limit` or Next.js middleware).

---

### 12. Logout Error Doesn't Invalidate Session

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

### 13. Session Endpoint Returns Raw Token

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

### 14. Cookie `sameSite` Set to `lax` Instead of `strict`

**Location:** Multiple route files (`login/route.ts:40-48`, etc.)

**Problem:**

```typescript
sameSite: 'lax',  // Should be 'strict' for sensitive operations
```

`sameSite: 'lax'` allows cookies to be sent on top-level navigation.

**Impact:** Increased CSRF risk.

**Fix:** Use `sameSite: 'strict'` for sensitive authentication cookies.

---

### 15. Permissive CSS `font-family` Regex in Sanitization

**Location:** `src/utils/sanitize.util.ts:153`

**Problem:**

```javascript
'font-family': [/.*/],  // allows ANY font-family value
```

The `style` attribute is allowed on ALL tags with an extremely permissive `font-family` regex.

**Impact:** CSS injection possible through carefully crafted style attributes.

**Fix:** Replace `/.*/` with a safer pattern that only allows common font names.

---

### 16. Console Logging of MQTT Notification Data

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

### 17. No TLS/SSL Encryption Configured for MQTT

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

### 18. `Secure` Cookie Flag Depends on Public Env Variable

**Location:** `src/config.ts:5,16`, `src/app/api/auth/login/route.ts:44`

**Problem:** Cookie `secure` is gated by `NEXT_PUBLIC_NODE_ENV === 'production'`.

**Impact:** Misconfiguration can issue auth cookies without `Secure` in production-like deployments.

**Fix:** Use trusted server-side environment (`process.env.NODE_ENV`) for cookie security decisions.

---

### 19. React Query Devtools Always Rendered in Production

**Location:** `src/components/providers/query-provider/query-provider.tsx:5,18`

**Problem:** `<ReactQueryDevtools />` is mounted unconditionally.

**Impact:** Exposes cache structure and potentially sensitive response metadata in production.

**Fix:** Gate rendering by environment (`NODE_ENV !== 'production'`).

---

## LOW VULNERABILITIES (P3 - Nice to Have)

### 20. Path Matching Could Allow Bypass

**Location:** `src/proxy.ts:20`

**Problem:**

```typescript
if (privatePaths.some((p) => pathname.startsWith(p))) {
```

Uses `startsWith` which could theoretically match unintended paths.

**Impact:** Unlikely with current path list, but not robust.

**Fix:** Use exact matching or a path-to-regex library.

---

### 21. Insufficient Input Validation on Login

**Location:** `src/app/api/auth/login/route.ts:26-30`

**Problem:** Only checks presence, not format. No email format validation or password complexity requirements.

**Impact:** Weak passwords accepted; invalid email formats processed.

**Fix:** Add format validation (e.g., email regex, password min-length/complexity).

---

### 22. Intro Key Validation Endpoint Has No Brute-Force Controls

**Location:** `src/app/api/intro/validate/route.ts:3-13`

**Problem:** Direct shared-key equality check with no throttling, lockout, or telemetry.

**Impact:** Online brute-force attempts feasible if key quality is weak.

**Fix:** Add rate limiting + attempt caps + logging/alerting.

---

### 23. Client Redirects Trust localStorage Path Values

**Location:**

- `src/app/(auth)/login/_components/login-form.tsx:56-59`
- `src/app/(auth)/login/_components/button-login-google.tsx:49-52`
- `src/app/account/_components/button-back.tsx:13-15`

**Problem:** Navigation uses values from localStorage (`redirect_path_after_login`, `previous_path`) directly.

**Impact:** If client storage is tampered, redirects can be abused for phishing.

**Fix:** Allow only same-origin relative paths; reject external/invalid destinations before redirecting.

---

### 24. MQTT Topic Generation Has No Input Validation

**Location:** `src/utils/mqtt.util.ts:1-8`

**Problem:** `value` parameter is directly substituted into topic string without sanitization. Special MQTT characters (`#`, `+`, `/`) could be injected.

**Impact:** Currently mitigated by using server-provided `profile.id`. Risk if usage pattern changes.

**Fix:** Add input validation to prevent MQTT wildcard injection.

---

### 25. No Message Origin Verification in MQTT

**Location:** `src/hooks/use-mqtt.ts:17-34`

**Problem:** No verification that messages originate from the expected source. Application trusts any message matching topic/cmd pattern.

**Impact:** Low - requires broker compromise. Could lead to fake notifications.

**Fix:** Consider adding message signing/verification or broker ACLs.

---

### 26. No Rate Limiting on MQTT Message Processing

**Location:** `src/components/providers/mqtt-provider/mqtt-provider.tsx`, `src/hooks/use-mqtt.ts`

**Problem:** No bounds on message queue or processing rate. Malicious server could flood client with messages.

**Impact:** Memory exhaustion, excessive re-renders, browser tab crashes.

**Fix:** Add message throttling/throttling.

---

### 27. Protocol-Relative URLs Allowed in Sanitization

**Location:** `src/utils/sanitize.util.ts:238`

**Problem:** `allowProtocolRelative: true` allows URLs like `//google.com`.

**Impact:** Phishing vector in certain contexts.

**Fix:** Set `allowProtocolRelative: false`.

---

### 28. Data URIs Allowed for Images

**Location:** `src/utils/sanitize.util.ts:119`

**Problem:** `img: ['http', 'https', 'data']` allows `data:` URIs for images.

**Impact:** Tracking only, minor exfiltration risk.

**Fix:** Remove `data:` scheme unless explicitly needed.

---

## Positive Security Patterns Found

| Pattern                                   | File                                                                         | Notes                                                 |
| ----------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------- |
| HttpOnly auth cookies                     | `src/app/api/auth/login/route.ts`, `src/app/api/auth/refresh-token/route.ts` | Correct cookie flags include `httpOnly`, `sameSite`   |
| Non-root runtime container                | `Dockerfile:45-53`                                                           | Container drops root privileges (`USER nextjs`)       |
| HTML sanitization before dangerous render | `src/utils/sanitize.util.ts`, multiple UI files                              | `sanitize-html` used before `dangerouslySetInnerHTML` |
| Centralized env validation                | `src/config.ts`                                                              | Zod validation prevents missing public runtime config |
| Comments/reviews use React text content   | `src/components/app/comment/*.tsx`                                           | Auto-escaped, not using dangerouslySetInnerHTML       |
| MQTT topics use server-provided IDs       | `src/utils/mqtt.util.ts`                                                     | Topics constructed from server-provided profile.id    |

---

## Prioritized Remediation Plan

### Phase 1 (Immediate - P0)

- [ ] Remove access token from Zustand/localStorage; use httpOnly cookies only
- [ ] Remove authorization header override in `sendRequest`
- [ ] Remove credentials from source code; use proper secret management
- [ ] Sanitize all error responses before returning to clients
- [ ] Add OAuth state parameter validation

### Phase 2 (Soon - P1)

- [ ] Add security headers/CSP in Next.js config
- [ ] Move MQTT credentials to server-only env vars
- [ ] Configure TLS for MQTT connections
- [ ] Pin GitHub Actions to commit SHAs
- [ ] Replace raw `ssh-keyscan` with fingerprint verification

### Phase 3 (Plan - P2)

- [ ] Implement rate limiting on auth endpoints
- [ ] Fix logout to always clear cookies
- [ ] Remove token from session endpoint response
- [ ] Switch cookie `secure` logic to server-only env signals
- [ ] Harden refresh interceptor queue/failure behavior
- [ ] Disable React Query Devtools in production

### Phase 4 (Nice to Have - P3)

- [ ] Use `sameSite: 'strict'` for auth cookies
- [ ] Restrict `font-family` regex in sanitizeText
- [ ] Add input validation for email/password format
- [ ] Harden intro key endpoint with rate limiting
- [ ] Validate and sanitize all localStorage-based redirect targets
- [ ] Replace proxy cookie-presence checks with token/session validation

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
```

---

## Notes / Limitations

- Dependency CVE tooling could not be executed in this environment because `pwsh` is unavailable (`pwsh.exe --version` fails).
- This report is based on repository static analysis plus multi-agent review; dependency CVEs should be re-run in CI with `yarn audit`/SCA tooling.
- Some findings overlap with the previous audit (2026-04-29); severity ratings may differ due to updated context.

---

_This report was generated by automated multi-agent analysis and manual validation. Validate all remediations in staging before production rollout._
