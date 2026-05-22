# Security Audit Report

**Generated:** 2026-05-22  
**Scope:** Frontend repository static security review covering auth/session, route protection, client rendering/data flow, URL handling, dependencies, Docker/CI, headers, public environment exposure, and MQTT.  
**Method:** 3 parallel security subagent scans plus local verification. Restricted files were not read: `supersecrets.txt`, `credentials.json`, `.env`, `.env.local`.

---

## Executive Summary

| Category | Issues Found | Critical | High | Medium | Low |
| -------- | ------------ | -------- | ---- | ------ | --- |
| Total    | 8            | 0        | 5    | 2      | 1   |

### Highest-Priority Findings

1. The refresh flow still returns fresh token material to browser JavaScript and caches the access token in client memory.
2. Post-login redirects trust raw `localStorage` and write directly to `window.location.href`.
3. MQTT credentials are intentionally bundled into the public client build via `NEXT_PUBLIC_*`.
4. Auth state-changing routes have no visible CSRF or origin validation.
5. The deploy workflow trusts the SSH host key from the network at deploy time.

### Dependency Audit

Live `yarn audit --groups dependencies` result on `2026-05-22` reported `28 vulnerabilities`:

- `1 Critical`
- `10 High`
- `16 Moderate`
- `1 Low`

Notable packages flagged by the audit output include `sanitize-html@2.17.0`, `axios@1.13.2`, `swiper@12.0.3`, `mqtt` via `ws`, and `next` via `postcss`.

---

## High Vulnerabilities

### 1. Refresh Flow Defeats the `HttpOnly` Token Boundary

**Severity:** High  
**Type:** CWE-200 / CWE-922, Sensitive Information Exposure  
**OWASP:** A02:2021 - Cryptographic Failures, A07:2021 - Identification and Authentication Failures  
**Locations:** `src/app/api/auth/refresh-token/route.ts:43-67`, `src/utils/http.util.ts:46-57`, `src/utils/http.util.ts:158-193`

**Evidence:**

```ts
const accessToken = res.access_token;
const refreshToken = res.refresh_token;

return NextResponse.json(
  { result: true, data: res },
  { status: HttpStatusCode.Ok }
);
```

```ts
if (data?.result && data?.data) {
  const newAccessToken = data.data.access_token;
  if (isClient) {
    clientAccessToken = newAccessToken;
    return newAccessToken;
  }
}
```

**Impact:** Any same-origin XSS can call `/api/auth/refresh-token`, read fresh bearer tokens from the JSON response, and replay them outside the browser. That largely cancels the security value of storing tokens in `HttpOnly` cookies.

**Remediation:** Keep refresh responses server-confined. Return only session metadata to the browser, and move authenticated upstream API/media access behind same-origin server routes or another backend-for-frontend proxy.

**Effort:** Moderate to Extensive

---

### 2. Post-Login Redirect Trusts Untrusted `localStorage`

**Severity:** High  
**Type:** CWE-79 / CWE-601, Cross-Site Scripting and Open Redirect  
**OWASP:** A03:2021 - Injection, A01:2021 - Broken Access Control  
**Locations:** `src/app/(auth)/login/_components/login-form.tsx:32-35`, `src/app/(auth)/login/_components/button-login-google.tsx:35-38`, `src/utils/storage.util.ts:9-10`

**Evidence:**

```ts
const redirectPath = getData(storageKeys.REDIRECT_PATH_AFTER_LOGIN);
removeData(storageKeys.REDIRECT_PATH_AFTER_LOGIN);
window.location.href = redirectPath || route.home.path;
```

**Impact:** If `redirect_path_after_login` is ever polluted, successful login navigates to attacker-controlled input. `javascript:` values become an authenticated DOM XSS sink, and absolute external URLs enable phishing or bounce-after-login flows.

**Remediation:** Only allow internal relative paths beginning with `/`, reject `javascript:` and absolute URLs, and default to a known safe route on validation failure.

**Effort:** Quick

---

### 3. Public MQTT Credentials Are Shipped to the Browser

**Severity:** High  
**Type:** CWE-798 / CWE-200, Exposed Credentials  
**OWASP:** A07:2021 - Identification and Authentication Failures, A05:2021 - Security Misconfiguration  
**Locations:** `src/config.ts:10-12`, `src/lib/mqtt.ts:13-18`, `Dockerfile:26-40`, `.github/workflows/docker.yml:40-42`

**Evidence:**

```ts
client = mqtt.connect(envConfig.NEXT_PUBLIC_MQTT_BROKER as string, {
  username: envConfig.NEXT_PUBLIC_MQTT_USERNAME as string,
  password: envConfig.NEXT_PUBLIC_MQTT_PASSWORD as string
});
```

**Impact:** Any user can recover these values from the shipped JS bundle or runtime and authenticate directly to the broker. If broker ACLs are weak, this can allow unauthorized publish/subscribe, spoofed notifications, or cross-tenant topic access.

**Remediation:** Treat browser credentials as public. Prefer short-lived per-user broker tokens minted server-side, strict broker ACLs, or server-side MQTT bridging for privileged channels.

**Effort:** Moderate to Extensive

---

### 4. Auth Routes Have No Visible CSRF or Origin Enforcement

**Severity:** High  
**Type:** CWE-352, Cross-Site Request Forgery  
**OWASP:** A01:2021 - Broken Access Control, A05:2021 - Security Misconfiguration  
**Locations:** `src/app/api/auth/login/route.ts:16-65`, `src/app/api/auth/login/google/route.ts:15-47`, `src/app/api/auth/logout/route.ts:8-25`, `src/app/api/auth/refresh-token/route.ts:17-68`, `src/utils/http.util.ts:166-193`

**Evidence:** The reviewed route handlers accept state-changing requests and set or clear cookies, but do not validate `Origin`, `Referer`, or `X-CSRF-Token` before processing them.

**Impact:** Login CSRF and related same-site request forgery remain possible. `SameSite=Lax` reduces some cross-site cookie cases, but it does not replace explicit origin or CSRF validation for cookie-setting auth routes.

**Remediation:** Enforce `Origin` or `Referer` validation on state-changing auth endpoints and verify the CSRF token already issued by the application before mutating auth state.

**Effort:** Moderate

---

### 5. Deploy Workflow Trusts SSH Host Keys From the Network

**Severity:** High  
**Type:** CWE-295, Improper Certificate or Host Validation  
**OWASP:** A05:2021 - Security Misconfiguration  
**Location:** `.github/workflows/docker.yml:71-80`

**Evidence:**

```yaml
echo "${{ secrets.VPS_SSH_KEY }}" > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa
ssh-keyscan ${{ secrets.VPS_HOST }} >> ~/.ssh/known_hosts
ssh ${{ secrets.VPS_USERNAME }}@${{ secrets.VPS_HOST }} << 'EOF'
```

**Impact:** A DNS or network MITM between the GitHub runner and the VPS can present a fake host key, intercept the SSH session, and capture deploy-time secrets passed into the remote container run.

**Remediation:** Pin the expected host public key in repository or Actions secrets and write that exact key into `known_hosts` instead of trusting `ssh-keyscan` during the job.

**Effort:** Quick

---

## Medium Vulnerabilities

### 6. Missing Content Security Policy

**Severity:** Medium  
**Type:** CWE-693, Protection Mechanism Failure  
**OWASP:** A05:2021 - Security Misconfiguration  
**Location:** `next.config.ts:47-79`

**Evidence:** The app sets `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `X-Robots-Tag`, and HSTS, but no `Content-Security-Policy`.

**Impact:** If an XSS sink is reached, there is no policy-level containment for script execution or outbound data exfiltration. There is also no `connect-src` restriction for browser requests such as HTTPS, WebSocket, or MQTT endpoints.

**Remediation:** Add a CSP with constrained `default-src`, `script-src`, `style-src`, `img-src`, `connect-src`, `media-src`, and `frame-ancestors` directives aligned with the real application origins.

**Effort:** Moderate

---

### 7. Route Protection and UI Auth State Trust Presence More Than Validity

**Severity:** Medium  
**Type:** CWE-287 / CWE-306, Improper Authentication  
**OWASP:** A01:2021 - Broken Access Control, A07:2021 - Identification and Authentication Failures  
**Locations:** `src/proxy.ts:14-25`, `src/app/api/auth/session/route.ts:34-53`, `src/components/providers/app-provider/app-provider.tsx:48-53`

**Evidence:**

```ts
if (privatePaths.some((p) => pathname.startsWith(p))) {
  if (!accessToken) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }
}
```

```ts
useEffect(() => {
  if (session?.authenticated) {
    setCsrfToken(session.csrfToken);
    setProfile(session.profile);
  }
}, [session, setCsrfToken, setProfile]);
```

**Impact:** Expired or revoked cookies still pass the proxy check until a deeper request fails, and client profile state is only updated on the truthy path. That can expose protected route shells or stale privileged UI after logout or expiry.

**Remediation:** Clear auth state when `session.authenticated` is false, and gate protected routes on validated session state rather than cookie presence alone.

**Effort:** Moderate

---

## Low Vulnerabilities

### 8. React Query Devtools Ship in Production UI

**Severity:** Low  
**Type:** CWE-200, Information Exposure  
**OWASP:** A05:2021 - Security Misconfiguration  
**Location:** `src/components/providers/query-provider/query-provider.tsx:5-18`

**Evidence:**

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<ReactQueryDevtools initialIsOpen={false} />;
```

**Impact:** Cached query data, query keys, and request state are exposed to any user who opens the in-app devtools panel. This is not a primary auth break, but it increases accidental data exposure and client attack surface.

**Remediation:** Render React Query Devtools only in development builds.

**Effort:** Quick

---

## Dependency Findings

Live `yarn audit --groups dependencies` on `2026-05-22` reported `28` vulnerabilities. The most actionable packages from the current audit output are:

| Package          | Current    | Reported Issue Summary                                  | Suggested Action                    |
| ---------------- | ---------- | ------------------------------------------------------- | ----------------------------------- |
| `sanitize-html`  | `2.17.0`   | Critical sanitizer-related advisory remains present     | Replace or remove if possible       |
| `axios`          | `1.13.2`   | Multiple SSRF, redirect, and prototype-pollution issues | Upgrade to patched `1.15.x+`        |
| `mqtt > ws`      | transitive | Memory disclosure in `ws`                               | Pull patched `ws` transitively      |
| `swiper`         | `12.0.3`   | Advisory present in current audit output                | Upgrade to patched version          |
| `next > postcss` | transitive | PostCSS XSS advisory                                    | Pull patched `postcss` transitively |

Exploitability depends on code path, but these findings should be treated as upgrade work rather than informational noise.

---

## Recommended Remediation Order

1. Stop returning refreshed token material to browser JavaScript.
2. Validate and constrain post-login redirect targets.
3. Remove long-lived public MQTT credentials from the browser trust model.
4. Add CSRF and origin validation to internal auth routes.
5. Pin the VPS SSH host key in the deploy workflow.
6. Add a production CSP.
7. Upgrade or replace vulnerable dependencies and rerun `yarn audit`.
