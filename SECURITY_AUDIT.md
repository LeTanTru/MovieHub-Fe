# Security Audit Report

**Generated:** 2026-04-29  
**Scope:** Full application security review (app/auth/infra/CI)  
**Method:** Multi-agent static analysis + manual validation

---

## Executive Summary

| Category | Issues Found | Critical | High | Medium | Low |
| -------- | ------------ | -------- | ---- | ------ | --- |
| Total    | 11           | 0        | 4    | 4      | 3   |

### Key Findings

1. **Token exposure in auth APIs/client state** weakens HttpOnly-cookie protections.
2. **Missing security headers/CSP** leaves browser-side defenses incomplete.
3. **CI/CD supply-chain hardening gaps** (unpinned actions + TOFU SSH host trust).
4. **Auth/session robustness issues** (refresh interceptor queue risk, weak route guard checks).
5. **Debug/error data exposure risks** (React Query Devtools in prod, upstream error passthrough).

---

## High Severity Issues (Fix Immediately)

### 1. Auth tokens are re-exposed to browser JavaScript ⚠️

**Affected Files:**

- `src/app/api/auth/session/route.ts:8-14`
- `src/app/api/auth/login/route.ts:60-63`
- `src/app/api/auth/login/google/route.ts:43-45`
- `src/app/api/auth/refresh-token/route.ts:62-66`
- `src/components/providers/app-provider/app-provider.tsx:54-56`
- `src/app/(auth)/login/_components/login-form.tsx:42-45`
- `src/app/(auth)/login/_components/button-login-google.tsx:37`

**Problem:**
Tokens are stored in HttpOnly cookies, but the app also returns token payloads in JSON and stores access tokens in client state.

**Impact:**  
Any XSS or malicious injected script can exfiltrate access/refresh tokens and hijack sessions.

**Fix:**

- Stop returning token material from `/api/auth/*` responses.
- Keep auth tokens server-only (HttpOnly cookie/BFF pattern).
- Make `/api/auth/session` return only non-sensitive session state (`authenticated`, profile claims).

---

### 2. Missing baseline security headers and CSP ⚠️

**Affected File:** `next.config.ts:6-46`

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

### 3. GitHub Actions are not pinned to immutable SHAs ⚠️

**Affected File:** `.github/workflows/docker.yml:13,16,19,25`

**Problem:**  
Workflow uses tag-based action refs (`@v4`, `@v3`, `@v6`) instead of commit SHA pinning.

**Impact:**  
If an upstream action tag is compromised/moved, attacker-controlled code may run in CI with repository secrets.

**Fix:**  
Pin all third-party actions to full commit SHAs and periodically rotate pin updates.

---

### 4. SSH host trust bootstrap uses raw `ssh-keyscan` (TOFU) ⚠️

**Affected File:** `.github/workflows/docker.yml:73`

**Problem:**  
Host key is fetched dynamically and trusted without fingerprint verification.

**Impact:**  
MITM during bootstrap could poison `known_hosts` and compromise deployment commands/secrets.

**Fix:**  
Store the expected host fingerprint in secrets/repo and verify before adding to `known_hosts`.

---

## Medium Severity Issues

### 5. `Secure` cookie flag depends on public env variable

**Affected Files:**

- `src/config.ts:5,16`
- `src/app/api/auth/login/route.ts:44`
- `src/app/api/auth/login/google/route.ts:27`
- `src/app/api/auth/refresh-token/route.ts:46`

**Problem:**  
Cookie `secure` is gated by `NEXT_PUBLIC_NODE_ENV === 'production'`.

**Impact:**  
Misconfiguration can issue auth cookies without `Secure` in production-like deployments.

**Fix:**  
Use trusted server-side environment (`process.env.NODE_ENV`) for cookie security decisions.

---

### 6. Refresh interceptor queue can stall requests on refresh-auth failures

**Affected File:** `src/utils/http.util.ts:43-57,63-97`

**Problem:**  
401 handling retries with a shared refresh queue using the same axios instance. Failures on refresh path can cause queue stalls/loop-like behavior.

**Impact:**  
Client-side auth request DoS/hanging behavior during token refresh edge cases.

**Fix:**

- Exclude refresh endpoint from refresh-on-401 logic.
- Ensure deterministic queue cleanup in all failure branches.
- Force logout/clear state when refresh fails.

---

### 7. React Query Devtools is always rendered (including production)

**Affected File:** `src/components/providers/query-provider/query-provider.tsx:5,18`

**Problem:**  
`<ReactQueryDevtools />` is mounted unconditionally.

**Impact:**  
Can expose cache structure and potentially sensitive response metadata in production clients.

**Fix:**  
Gate rendering by environment (`NODE_ENV !== 'production'`) and keep devtools dependency out of production bundle where possible.

---

### 8. Intro key validation endpoint has no brute-force controls

**Affected File:** `src/app/api/intro/validate/route.ts:3-13`

**Problem:**  
Endpoint performs direct shared-key equality check with no throttling, lockout, or telemetry.

**Impact:**  
Online brute-force attempts are feasible if key quality is weak or leaked.

**Fix:**  
Add rate limiting + attempt caps + logging/alerting; enforce strong key rotation policy.

---

## Low Severity Issues

### 9. Route protection checks cookie presence only (not token validity)

**Affected File:** `src/proxy.ts:16-23`

**Problem:**  
Protected routes allow access if cookie exists, even if token is expired/invalid.

**Impact:**  
Weak boundary at route-gate layer (UI route exposure until downstream API denies).

**Fix:**  
Validate token expiry/claims in middleware or verify server session before allowing protected routes.

---

### 10. Upstream auth errors are passed through to clients

**Affected Files:**

- `src/app/api/auth/login/route.ts:70-76`
- `src/app/api/auth/login/google/route.ts:62-68`
- `src/app/api/auth/refresh-token/route.ts:77-83`
- `src/app/api/auth/logout/route.ts:24-30`

**Problem:**  
Routes spread upstream error payloads (`...response`) directly to client.

**Impact:**  
Potential information disclosure (internal message formats, backend hints).

**Fix:**  
Return normalized/sanitized error schema to clients; keep detailed errors server-side only.

---

### 11. Client redirects trust localStorage path values without strict validation

**Affected Files:**

- `src/app/(auth)/login/_components/login-form.tsx:56-59`
- `src/app/(auth)/login/_components/button-login-google.tsx:49-52`
- `src/app/account/_components/button-back.tsx:13-15`

**Problem:**  
Navigation uses values from localStorage (`redirect_path_after_login`, `previous_path`) directly.

**Impact:**  
If client storage is tampered (XSS/script injection), redirects can be abused for phishing/navigation abuse.

**Fix:**  
Allow only same-origin relative paths and reject external/invalid destinations before redirecting.

---

## Positive Security Patterns Found

| Pattern                                   | File                                                                         | Notes                                                 |
| ----------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------- |
| HttpOnly auth cookies                     | `src/app/api/auth/login/route.ts`, `src/app/api/auth/refresh-token/route.ts` | Correct cookie flags include `httpOnly`, `sameSite`   |
| Non-root runtime container                | `Dockerfile:45-53`                                                           | Container drops root privileges (`USER nextjs`)       |
| HTML sanitization before dangerous render | `src/utils/sanitize.util.ts`, multiple UI files                              | `sanitize-html` used before `dangerouslySetInnerHTML` |
| Centralized env validation                | `src/config.ts`                                                              | Zod validation prevents missing public runtime config |

---

## Prioritized Remediation Plan

### Phase 1 (Immediate)

- [ ] Remove token material from auth JSON responses and client state.
- [ ] Add security headers/CSP in Next.js config.
- [ ] Pin GitHub Actions to commit SHAs.
- [ ] Replace raw `ssh-keyscan` trust bootstrap with fingerprint verification.

### Phase 2

- [ ] Switch cookie `secure` logic to server-only env signals.
- [ ] Harden refresh interceptor queue/failure behavior.
- [ ] Disable React Query Devtools in production.

### Phase 3

- [ ] Harden intro key endpoint with rate limiting and key rotation controls.
- [ ] Validate and sanitize all localStorage-based redirect targets.
- [ ] Replace proxy cookie-presence checks with token/session validation.

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

---

_This report was generated by automated multi-agent analysis and manual validation. Validate all remediations in staging before production rollout._
