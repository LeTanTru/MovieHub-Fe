# Security Audit Report

**Generated:** 2026-05-24  
**Scope:** Frontend repository static security review covering auth/session handling, route protection, browser trust boundaries, redirect handling, rich HTML rendering, headers, public environment exposure, and CI/CD deployment.  
**Method:** Manual static analysis using the repository code plus the scanner guidance in `.claude/agents/security-vulnerability-scanner.md`. Restricted files were not read: `supersecrets.txt`, `credentials.json`, `.env`, `.env.local`.

---

## Executive Summary

| Category | Issues Found | Critical | High | Medium | Low |
| -------- | ------------ | -------- | ---- | ------ | --- |
| Total    | 7            | 0        | 5    | 2      | 0   |

### Highest-Priority Findings

1. The app returns bearer token material to browser JavaScript on login, refresh, and session bootstrap, defeating the `HttpOnly` cookie boundary.
2. Post-login redirects trust attacker-influenced `localStorage` and write directly to `window.location.href`.
3. MQTT credentials are intentionally bundled into the public client build.
4. Cookie-authenticated auth routes have no visible CSRF or origin enforcement.
5. The deploy workflow trusts the SSH host key from the network at deploy time.

### What Was Not Confirmed

- `yarn audit --groups dependencies` was attempted on **2026-05-24** but failed because the Yarn advisory endpoint was unreachable from this environment: `ECONNREFUSED 127.0.0.1:9`.
- No runtime edge/CDN configuration was visible here, so protections that may exist outside the repo, such as WAF rules, rate limiting, or extra headers, were not credited unless they were present in code.

---

## High Vulnerabilities

### 1. Auth Token Boundary Is Broken Across Login, Refresh, and Session Bootstrap

**Severity:** High  
**Vulnerability Type:** Sensitive token exposure, CWE-200 / CWE-922  
**OWASP Category:** A02:2021 - Cryptographic Failures, A07:2021 - Identification and Authentication Failures  
**Location:** `src/app/api/auth/login/route.ts:84-86`, `src/app/api/auth/login/google/route.ts:63-65`, `src/app/api/auth/refresh-token/route.ts:65-67`, `src/app/api/auth/session/route.ts:36-44`, `src/utils/http.util.ts:45-57`, `src/components/providers/app-provider/app-provider.tsx:50-56`, `src/types/auth.type.ts:28-35`, `src/types/auth.type.ts:47-51`

**Evidence:**

```ts
return NextResponse.json(
  { result: true, data: { ...res, profile } },
  { status: HttpStatusCode.Ok }
);
```

```ts
return NextResponse.json(
  { result: true, data: { ...res, csrfToken } },
  { status: HttpStatusCode.Ok }
);
```

```ts
data: {
  (accessToken, csrfToken, profile);
}
```

```ts
const newAccessToken = data.data.access_token;
useAuthStore.getState().setAccessToken(newAccessToken);
```

**Impact Analysis:** The application sets auth cookies as `HttpOnly`, but then immediately returns `access_token` and `refresh_token` in JSON responses and stores the access token in client state. Any same-origin XSS can read or replay tokens directly, which largely nullifies the protection intended by the cookie boundary.

**Remediation:** Keep bearer tokens server-confined. Do not return `access_token` or `refresh_token` from `/api/auth/login`, `/api/auth/login/google`, `/api/auth/refresh-token`, or `/api/auth/session`. Return only non-sensitive session metadata to the browser and proxy authenticated upstream calls through same-origin server endpoints if the UI still needs authenticated access.

**Effort to Fix:** Extensive

---

### 2. Post-Login Redirect Trusts Untrusted `localStorage`

**Severity:** High  
**Vulnerability Type:** Open redirect / DOM XSS sink, CWE-601 / CWE-79  
**OWASP Category:** A01:2021 - Broken Access Control, A03:2021 - Injection  
**Location:** `src/app/(auth)/login/_components/login-form.tsx:53-57`, `src/app/(auth)/login/_components/button-login-google.tsx:46-50`, `src/utils/storage.util.ts:3-10`

**Evidence:**

```ts
const redirectPath = getData(storageKeys.REDIRECT_PATH_AFTER_LOGIN);
removeData(storageKeys.REDIRECT_PATH_AFTER_LOGIN);
window.location.href = redirectPath || route.home.path;
```

```ts
return isBrowser() ? localStorage.getItem(key) : null;
```

**Impact Analysis:** `localStorage` is attacker-influenceable. If `redirect_path_after_login` is polluted, successful login navigates to attacker-controlled input. That enables external redirect abuse and, depending on browser behavior and input shape, can become a `javascript:` navigation sink.

**Remediation:** Allow only safe internal relative paths that begin with `/`, reject protocol-relative, absolute, and `javascript:` values, and fall back to a known-safe route when validation fails.

**Effort to Fix:** Quick

---

### 3. Public MQTT Credentials Are Embedded in the Browser Build

**Severity:** High  
**Vulnerability Type:** Exposed credentials, CWE-798 / CWE-200  
**OWASP Category:** A05:2021 - Security Misconfiguration, A07:2021 - Identification and Authentication Failures  
**Location:** `src/config.ts:13-15`, `src/lib/mqtt.ts:13-19`, `Dockerfile:26-40`, `.github/workflows/docker.yml:31-42`, `.github/workflows/docker.yml:94-96`

**Evidence:**

```ts
client = mqtt.connect(envConfig.NEXT_PUBLIC_MQTT_BROKER as string, {
  username: envConfig.NEXT_PUBLIC_MQTT_USERNAME as string,
  password: envConfig.NEXT_PUBLIC_MQTT_PASSWORD as string,
```

```ts
NEXT_PUBLIC_MQTT_USERNAME: z.string(),
NEXT_PUBLIC_MQTT_PASSWORD: z.string()
```

**Impact Analysis:** Any user can recover these values from the client bundle or runtime and authenticate directly to the broker. If broker ACLs are weak, this can allow unauthorized topic access, spoofed notifications, or cross-tenant data exposure.

**Remediation:** Treat browser-delivered credentials as public. Replace them with short-lived scoped tokens minted server-side, strict topic ACLs, or a server-side broker bridge for privileged channels.

**Effort to Fix:** Moderate to Extensive

---

### 4. Cookie-Authenticated Auth Routes Have No Visible CSRF or Origin Checks

**Severity:** High  
**Vulnerability Type:** Cross-Site Request Forgery, CWE-352  
**OWASP Category:** A01:2021 - Broken Access Control, A05:2021 - Security Misconfiguration  
**Location:** `src/app/api/auth/login/route.ts:21-47`, `src/app/api/auth/login/google/route.ts:17-26`, `src/app/api/auth/logout/route.ts:8-20`, `src/app/api/auth/refresh-token/route.ts:17-45`

**Evidence:**

```ts
export async function POST(request: NextRequest) {
  const body: LoginBodyType = await request.json();
```

```ts
export async function POST() {
  const res = await http.post<ApiResponseNoData>(apiConfig.user.logout);
```

No reviewed auth route validates `Origin`, `Referer`, or a CSRF token before mutating auth cookies or session state.

**Impact Analysis:** Cross-site requests can target login, refresh, and logout flows that mutate cookie-backed auth state. `SameSite=Lax` reduces some abuse but does not replace explicit origin or CSRF validation for state-changing auth endpoints.

**Remediation:** Enforce strict `Origin` or `Referer` validation on all state-changing internal auth routes, and validate a CSRF token on the routes that rely on cookies for authentication state.

**Effort to Fix:** Moderate

---

### 5. Deploy Workflow Trusts SSH Host Keys From the Network

**Severity:** High  
**Vulnerability Type:** Improper host validation, CWE-295  
**OWASP Category:** A05:2021 - Security Misconfiguration  
**Location:** `.github/workflows/docker.yml:71-80`

**Evidence:**

```yaml
echo "${{ secrets.VPS_SSH_KEY }}" > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa
ssh-keyscan ${{ secrets.VPS_HOST }} >> ~/.ssh/known_hosts
ssh ${{ secrets.VPS_USERNAME }}@${{ secrets.VPS_HOST }} << 'EOF'
```

**Impact Analysis:** A network or DNS MITM between the GitHub runner and the VPS can present a malicious host key, intercept the deploy session, and capture deploy-time secrets.

**Remediation:** Pin the expected VPS host public key in repository configuration or GitHub secrets and write that exact key into `known_hosts` instead of learning it at deploy time.

**Effort to Fix:** Quick

---

## Medium Vulnerabilities

### 6. Missing Content Security Policy

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

No `Content-Security-Policy` header is configured in the visible application code.

**Impact Analysis:** If an XSS sink is reached, there is no policy-level containment for script execution or outbound data exfiltration. This is especially relevant because the app already exposes bearer material to browser JavaScript.

**Remediation:** Add a production CSP with at least constrained `default-src`, `script-src`, `style-src`, `img-src`, `connect-src`, `media-src`, and `frame-ancestors` directives aligned with the app’s real origins and MQTT/WebSocket needs.

**Effort to Fix:** Moderate

---

### 7. Route and Client Auth State Trust Cookie Presence More Than Session Validity

**Severity:** Medium  
**Vulnerability Type:** Improper authentication, CWE-287 / CWE-306  
**OWASP Category:** A01:2021 - Broken Access Control, A07:2021 - Identification and Authentication Failures  
**Location:** `src/proxy.ts:14-25`, `src/app/api/auth/session/route.ts:15-24`, `src/components/providers/app-provider/app-provider.tsx:50-56`

**Evidence:**

```ts
const accessToken = request.cookies.get(storageKeys.ACCESS_TOKEN)?.value;
if (privatePaths.some((p) => pathname.startsWith(p))) {
  if (!accessToken) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }
}
```

```ts
if (session) {
  setAccessToken(session.accessToken);
  setCsrfToken(session.csrfToken);
  setProfile(session.profile);
}
```

**Impact Analysis:** Protected route access is gated on cookie presence rather than confirmed token validity. Expired or revoked cookies can still pass the proxy check until a deeper request fails, and the client provider does not clear auth state when the session becomes unauthenticated.

**Remediation:** Base route protection on validated session state rather than cookie existence alone, and explicitly clear client auth state when session bootstrap fails or returns unauthenticated data.

**Effort to Fix:** Moderate

---

## Dependency Audit Status

Dependency vulnerability counts were **not** verified in this run.

Attempted command on **2026-05-24**:

```bash
yarn audit --groups dependencies
```

Result:

```text
error Error: https://registry.yarnpkg.com/-/npm/v1/security/audits:
tunneling socket could not be established, cause=connect ECONNREFUSED 127.0.0.1:9
```

Because the advisory feed was unreachable, no current vulnerability count or package-level advisory list is included in this report. Re-run `yarn audit --groups dependencies` from a network path that can reach the Yarn registry before treating dependency risk as cleared.

---

## Notes From Broader Review

- Rich HTML rendering paths use `sanitize-html` before `dangerouslySetInnerHTML`, and JSON-LD output escapes `<`, `>`, `&`, `U+2028`, and `U+2029`, so no additional confirmed DOM XSS sink was identified in those reviewed paths.
- Cookie options are otherwise reasonable for production: `httpOnly: true`, `sameSite: 'lax'`, and `secure` outside development in `src/app/api/auth/_lib/make-cookie-option.ts`.

---

## Recommended Remediation Order

1. Stop returning `access_token` and `refresh_token` to browser JavaScript from login, refresh, and session endpoints.
2. Validate and constrain post-login redirect destinations.
3. Remove long-lived MQTT credentials from the browser trust model.
4. Add CSRF and strict origin validation to internal auth routes.
5. Pin the VPS SSH host key in GitHub Actions.
6. Add a production CSP.
7. Tighten route protection to validated session state and clear stale client auth state.
