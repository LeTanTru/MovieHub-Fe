# Security Best Practices Report

Generated: 2026-06-17

Scope: Static review of the Next.js/React frontend repository, route handlers, auth/session flow, browser trust boundaries, deployment workflow, Docker build, dependency audit, rendering sinks, and security headers.

Restricted files not read: `supersecrets.txt`, `credentials.json`, `.env`, `.env.local`.

Guidance used: `.agents/skills/security-best-practices/SKILL.md`, Next.js server security reference, React frontend security reference, and general browser JavaScript security reference.

## Executive Summary

| Severity | Count |
| -------- | ----: |
| Critical |     1 |
| High     |     4 |
| Medium   |     6 |
| Low      |     2 |

Highest priority work:

1. Upgrade vulnerable dependencies. `yarn audit --groups dependencies` currently reports 39 advisories, including 1 critical and 20 high.
2. Stop returning bearer tokens to browser JavaScript from the internal auth routes.
3. Pin the VPS SSH host key in CI instead of trusting `ssh-keyscan` during deployment.
4. Remove static browser-visible MQTT credentials or replace them with short-lived scoped credentials.
5. Add CSRF or strict Origin/Referer validation for cookie-mutating internal auth routes.

## Critical Findings

### SEC-001: Dependency Audit Has Critical and High Advisories

Rule ID: REACT-SUPPLY-001 / NEXT-SUPPLY-001
Severity: Critical
Location: `package.json:39`, `package.json:50`, `package.json:53`, `package.json:67-69`, `yarn.lock:1748`, `yarn.lock:3582`, `yarn.lock:3677`, `yarn.lock:3729`, `yarn.lock:4698`, `yarn.lock:5070-5075`

Evidence:

```text
yarn audit --groups dependencies
39 vulnerabilities found - Packages audited: 275
Severity: 1 Low | 17 Moderate | 20 High | 1 Critical
```

Critical advisory:

- `swiper` prototype pollution, direct dependency `swiper@^12.0.3`, patched in `>=12.1.2`.

High advisory groups visible in the audit:

- `axios@1.13.2`: multiple high prototype pollution, request hijacking, SSRF/NO_PROXY bypass, and DoS advisories. Some audit entries require `>=1.16.0`.
- `axios > form-data@4.0.5`: CRLF injection in multipart field names and filenames, patched in `>=4.0.6`.
- `mqtt > ws@8.20.0`: memory exhaustion DoS, patched in `>=8.21.0`.
- `@next/bundle-analyzer > webpack-bundle-analyzer > ws@7.5.10`: memory exhaustion DoS, patched in `>=7.5.11`.
- `rimraf > glob > minimatch@10.1.1`: ReDoS advisories, patched in `>=10.2.3`.
- `lodash@4.17.21`: code injection through `_.template` imports key names, patched in `>=4.18.0`.

Impact: Vulnerable packages run in the app, build pipeline, or tooling. The critical direct `swiper` issue is browser-reachable if affected code paths parse attacker-influenced objects. High `axios` issues affect both server and client request code, and the `mqtt > ws` issue matters because MQTT is used in browser runtime.

Fix: Upgrade direct dependencies first: `swiper`, `axios`, `mqtt`, `lodash`, `rimraf`, `@next/bundle-analyzer`, `sanitize-html`, and `next` as needed to pull patched transitive packages. Re-run `yarn install`, commit the lockfile, then rerun `yarn audit --groups dependencies`.

Mitigation: If an immediate upgrade is blocked, use Yarn `resolutions` for patched transitive packages where compatible, especially `ws`, `form-data`, `minimatch`, `follow-redirects`, and `postcss`.

False positive notes: Some advisories are conditional on specific APIs, but the audit confirms vulnerable versions are installed. Treat this as unresolved until patched versions are present in `yarn.lock`.

## High Findings

### SEC-002: Browser JavaScript Receives Bearer Tokens Despite HttpOnly Cookies

Rule ID: NEXT-SECRETS-001 / REACT-AUTH-001
Severity: High
Location: `src/app/api/auth/login/route.ts:47-74`, `src/app/api/auth/login/google/route.ts:24-65`, `src/app/api/auth/refresh-token/route.ts:18-20`, `src/app/api/auth/_lib/refresh-session.ts:78-80`, `src/app/api/auth/session/route.ts:67-74`, `src/components/providers/app-provider/app-provider.tsx:67-75`, `src/app/(auth)/login/_components/login-form.tsx:52-56`, `src/app/(auth)/login/_components/button-login-google.tsx:47-50`, `src/utils/http.util.ts:57-66`

Evidence:

```ts
const accessToken = res.access_token;
const refreshToken = res.refresh_token;
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
setAccessToken(session.accessToken);
setCsrfToken(session.csrfToken);
```

Impact: The app sets `HttpOnly` auth cookies, but then sends the same bearer token material to browser JavaScript and stores it in Zustand. Any XSS, compromised dependency, or malicious same-origin script can read and replay tokens.

Fix: Keep access and refresh tokens server-confined. Internal auth routes should return only non-sensitive session metadata. Use same-origin route handlers or a backend-for-frontend for authenticated API calls that need server-held cookies.

Mitigation: Until the architecture changes, reduce token lifetime, tighten CSP, and remove every unnecessary browser-readable token copy.

False positive notes: This is not a false positive if `res` includes `access_token` or `refresh_token`, which the local types and consuming components confirm.

### SEC-003: CI Trusts Runtime `ssh-keyscan` for Production Deploy Host Key

Rule ID: REACT-SUPPLY-001 / deployment hardening
Severity: High
Location: `.github/workflows/docker.yml:71-80`, `.github/workflows/docker.yml:86-97`

Evidence:

```yaml
echo "${{ secrets.VPS_SSH_KEY }}" > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa
ssh-keyscan ${{ secrets.VPS_HOST }} >> ~/.ssh/known_hosts
```

```yaml
ssh ${{ secrets.VPS_USERNAME }}@${{ secrets.VPS_HOST }} << 'EOF'
docker run -d \
-e APP_USERNAME='${{ secrets.APP_USERNAME }}' \
-e APP_PASSWORD='${{ secrets.APP_PASSWORD }}' \
-e GRANT_TYPE_REFRESH_TOKEN='${{ secrets.GRANT_TYPE_REFRESH_TOKEN }}' \
-e ACCESS_KEY='${{ secrets.ACCESS_KEY }}' \
```

Impact: A network attacker between the runner and VPS can feed a malicious SSH host key during `ssh-keyscan`. The following SSH step then trusts that key and sends deployment commands containing runtime secrets to the attacker-controlled host.

Fix: Store the expected VPS host public key in a GitHub secret such as `VPS_KNOWN_HOSTS` and write that value to `~/.ssh/known_hosts`. Do not discover the host key during the same deployment run.

Mitigation: Restrict deployment to a trusted network path, rotate runtime secrets if a deployment MITM is suspected, and avoid embedding secrets directly in remote command text where possible.

False positive notes: This remains an issue even though VPN is used; host key trust should still be pinned.

### SEC-004: Static MQTT Credentials Are Public Browser Build Inputs

Rule ID: REACT-CONFIG-001 / NEXT-SECRETS-001
Severity: High
Location: `src/config.ts:13-15`, `src/lib/mqtt.ts:13-15`, `src/components/providers/mqtt-provider/mqtt-provider.tsx:107-110`, `Dockerfile:26-40`, `.github/workflows/docker.yml:40-42`, `.github/workflows/docker.yml:94-96`

Evidence:

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

```ts
client.subscribe(
  generateMqttTopic(mqttTopics.ACCOUNT, {
    accountId: profile.id
  }),
```

Impact: `NEXT_PUBLIC_*` values are bundled into the browser and are not secret. Any user can extract the broker URL, username, and password. If broker ACLs allow broad topic access, attackers can subscribe to account topics or publish spoofed notifications.

Fix: Replace static public MQTT credentials with short-lived per-user credentials minted server-side, with broker ACLs scoped to that user and topic prefix. Rotate current broker credentials after the change.

Mitigation: Enforce broker-side ACLs immediately: no wildcard account subscriptions for the browser principal, no publish permission unless explicitly required, and per-user topic isolation.

False positive notes: Public broker credentials are sometimes intentional, but then they must be scoped as public, low-privilege credentials.

### SEC-005: Cookie-Mutating Auth Routes Lack Visible CSRF or Origin Validation

Rule ID: NEXT-CSRF-001 / REACT-CSRF-001
Severity: High
Location: `src/app/api/auth/login/route.ts:18-20`, `src/app/api/auth/login/google/route.ts:17-20`, `src/app/api/auth/refresh-token/route.ts:7-20`, `src/app/api/auth/logout/route.ts:8-20`, `src/app/api/auth/_lib/make-cookie-option.ts:6-11`, `src/constants/api-config.ts:12-40`, `src/utils/http.util.ts:205-232`

Evidence:

```ts
export async function POST() {
  const refreshedSession = await refreshSession();
```

```ts
export async function POST() {
  const res = await http.post<ApiResponseNoData>(apiConfig.user.logout);
```

```ts
httpOnly: true,
sameSite: 'lax',
secure: envConfig.NEXT_PUBLIC_NODE_ENV !== 'development',
```

```ts
if (isRequiredCsrfToken && csrfToken) {
  baseHeader[storageKeys.X_CSRF_TOKEN] = csrfToken;
}
```

No `apiConfig` entry currently sets `isRequiredCsrfToken: true`, and the reviewed auth route handlers do not validate `Origin` or `Referer`.

Impact: The internal auth routes create, rotate, and remove cookie-backed session state. `SameSite=Lax` is useful defense-in-depth, but it is not a complete CSRF strategy for state-changing cookie endpoints.

Fix: Add a shared guard for internal state-changing auth routes that validates `Origin` or `Referer` against `NEXT_PUBLIC_URL`. For authenticated cookie routes, also require `X-CSRF-Token` and compare it with a server-readable token.

Mitigation: Keep `SameSite=Lax`, reject non-JSON content types for JSON endpoints, and rate-limit auth state-changing routes.

False positive notes: External API calls using `Authorization: Bearer` are not cookie CSRF targets. This finding is about same-origin internal routes that mutate cookies.

## Medium Findings

### SEC-006: Intro Access Gate Is Client-Side and Not Enforced

Rule ID: NEXT-AUTH-001 / REACT-AUTHZ-001
Severity: Medium
Location: `src/components/providers/app-provider/app-provider.tsx:92-99`, `src/components/providers/app-provider/app-provider.tsx:121-138`, `src/app/(auth)/intro/_components/intro-form.tsx:32-38`, `src/app/api/intro/validate/route.ts:3-13`, `src/proxy.ts:5-13`

Evidence:

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

Impact: If `/intro` is meant to restrict public access, it is not a server-side boundary. The check is commented out, and the intended proof of access is localStorage, which users can edit.

Fix: Enforce intro access in `src/proxy.ts` or remove the feature as a security control. On successful validation, set a signed, expiring, `HttpOnly` cookie and validate it server-side.

Mitigation: Make clear in docs that `/intro` is cosmetic until server-side enforcement exists.

False positive notes: If `/intro` is intentionally not a security boundary, downgrade this to documentation cleanup.

### SEC-007: Intro Key Validation Has No Visible Rate Limiting

Rule ID: NEXT-DOS-001 / NEXT-INPUT-001
Severity: Medium
Location: `src/app/api/intro/validate/route.ts:3-13`

Evidence:

```ts
export async function POST(request: Request) {
  const { key } = await request.json();

  if (key === process.env.ACCESS_KEY) {
```

Impact: A public endpoint compares user input to a server secret without visible rate limiting, lockout, or body-size control. Attackers can brute-force weak keys or generate repeated load.

Fix: Add IP and attempt rate limiting, validate JSON shape with Zod, cap body size at the edge/runtime, and require a high-entropy key. If the gate is real access control, use the signed cookie design from SEC-006.

Mitigation: Use a long random key and monitor repeated failures until rate limiting lands.

False positive notes: Infrastructure might rate-limit this path outside the app. Verify at the CDN/reverse proxy if so.

### SEC-008: Route Protection Trusts Cookie Presence, Not Session Validity

Rule ID: NEXT-AUTH-002 / NEXT-CACHE-001
Severity: Medium
Location: `src/proxy.ts:15-35`, `src/proxy.ts:46-60`, `src/app/api/auth/session/route.ts:23-55`

Evidence:

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
```

```ts
matcher: [
  '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
```

Impact: Private page access is based on token cookie presence. Expired, malformed, or revoked cookies can pass the proxy check until deeper session/API code fails. Auth pages can redirect users away because a stale access-token cookie exists.

Fix: Use a signed server-readable session marker that proxy can validate cheaply, or call a lightweight session validation endpoint where acceptable. Clear stale auth cookies when refresh/session validation fails.

Mitigation: Keep protected data behind server/API authorization and treat proxy as UX gating only.

False positive notes: This is not a backend authorization bypass by itself if all APIs enforce auth correctly.

### SEC-009: Missing Content Security Policy

Rule ID: NEXT-CSP-001 / REACT-CSP-001
Severity: Medium
Location: `next.config.ts:47-79`

Evidence:

```ts
headers: [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Robots-Tag', value: 'index, follow' }
];
```

No `Content-Security-Policy` header is configured in visible app code.

Impact: If XSS is introduced through rich text, dependency compromise, or a future unsafe sink, there is no CSP containment for script execution or exfiltration. This is more important while browser-readable bearer tokens exist.

Fix: Add a production CSP via headers. Start in report-only if needed, then enforce. Include only required `connect-src` origins for API, media, Google auth, and MQTT/WebSocket.

Mitigation: Keep using `sanitizeText()` and React escaping, and avoid adding inline scripts or eval-like APIs.

False positive notes: CSP might be set by a CDN or reverse proxy outside this repo. Verify runtime headers.

### SEC-010: Rich HTML Sanitizer Policy Is Broader Than Current Use Cases Need

Rule ID: REACT-XSS-001 / REACT-MARKUP-001
Severity: Medium
Location: `src/utils/sanitize.util.ts:17-241`, `src/app/(home)/_components/slider/slider-item.tsx:181-182`, `src/components/app/watch/watch-info.tsx:163`, `src/app/person/[id]/_components/person-sidebar.tsx:126`, `src/components/app/collection/anime-item.tsx:155-156`, `src/components/app/movie-side/movie-side.tsx:127`

Evidence:

```ts
allowedAttributes: {
  '*': ['class', 'id', 'style'],
```

```ts
allowedSchemes: ['http', 'https', 'mailto', 'tel', 'data'],
```

```ts
allowedIframeHostnames: [
  'www.youtube.com',
  'youtube.com',
  'player.vimeo.com',
```

```ts
allowProtocolRelative: true,
```

```tsx
dangerouslySetInnerHTML={{
  __html: sanitizeText(slider.movie.description)
}}
```

Impact: No confirmed active XSS path was found, but the shared sanitizer allows inline styles, `data:` URLs for images, protocol-relative URLs, media tags, and iframes. Movie descriptions and bios usually do not need that much active surface, so future reuse or sanitizer edge cases have a larger blast radius.

Fix: Split sanitizers by trust level. Use a narrow rich-text sanitizer for descriptions/bios, and a separate explicitly named embed sanitizer for trusted iframe/media content. Disable protocol-relative URLs and remove `data:` unless required.

Mitigation: Add CSP and Trusted Types report-only mode after sanitizer tightening.

False positive notes: `sanitize-html` is a real sanitizer, so this is a defense-in-depth finding, not a confirmed exploit.

### SEC-011: Client-Side File Delete Sends Arbitrary `filePath` to Backend

Rule ID: NEXT-FILES-001 / NEXT-PATH-001
Severity: Medium
Location: `src/api-requests/file.api-request.ts:17-20`, `src/hooks/use-file-upload-manager.ts:79-89`, `src/hooks/use-file-upload-manager.ts:105-109`, `src/constants/api-config.ts:160-163`

Evidence:

```ts
export const deleteFile = (body: { filePath: string }) =>
  http.post<ApiResponseNoData>(apiConfig.file.delete, {
    body
  });
```

```ts
deleteFileMutate({
  filePath: url
});
```

Impact: The frontend sends a path-like value for deletion. If the media API trusts this path without ownership and path-boundary validation, users could delete files they do not own or target unexpected storage paths.

Fix: Prefer opaque upload IDs over raw file paths. Backend should verify ownership, normalize paths, reject `..` and absolute/external paths, and delete only within an allowed storage prefix.

Mitigation: Client-side validation can reduce accidents, but this must be enforced server-side.

False positive notes: The backend may already enforce ownership and safe path rules. This frontend repo cannot verify that.

## Low Findings

### SEC-012: `.gitignore` Does Not Ignore `.env.local`

Rule ID: NEXT-SECRETS-001 / REACT-CONFIG-001
Severity: Low
Location: `.gitignore:33-35`, `.dockerignore:5`

Evidence:

```gitignore
# env files (can opt-in for committing if needed)
.env
```

`git ls-files .env .env.local supersecrets.txt credentials.json` returned no tracked files, but `.env.local` is not ignored by `.gitignore`.

Impact: `.env.local` is a restricted secret file in this repo's agent instructions. Since it is not ignored, it can be accidentally staged and committed.

Fix: Ignore `.env*` and explicitly unignore `.env.example` if that file should stay tracked.

Mitigation: Keep secret scanning enabled in the remote repo and pre-commit hooks.

False positive notes: No restricted secret file is currently tracked.

### SEC-013: HSTS Preload Is Enabled Without Visible Environment Gate

Rule ID: NEXT-HEADERS-001
Severity: Low
Location: `next.config.ts:70-77`

Evidence:

```ts
{
  key: 'Strict-Transport-Security',
  value: 'max-age=31536000; includeSubDomains; preload'
}
```

Impact: HSTS with `includeSubDomains; preload` is sticky and operationally risky if every subdomain is not HTTPS-ready or if the domain is submitted to browser preload lists prematurely.

Fix: Keep HSTS only if the production domain and all subdomains are HTTPS-ready. Remove `preload` unless the domain is intentionally prepared for preload submission.

Mitigation: Manage this header at the edge where production-only behavior is clear.

False positive notes: This can be correct for mature HTTPS-only domains. Verify production domain readiness.

## Reviewed Areas Without Confirmed Findings

- `getSafeRedirectPath()` rejects non-relative, protocol-relative, and cross-origin redirect values before login redirects.
- JSON-LD script output uses `safeJsonLd()`.
- No `eval`, `new Function`, `document.write`, `innerHTML`, service worker registration, or broad `postMessage('*')` pattern was found in the reviewed source.
- Docker runtime uses `NODE_ENV=production`, non-root `nextjs`, and `node server.js`.
- `.dockerignore` excludes `.env*` from Docker build context.

## Recommended Remediation Order

1. Patch dependency advisories and commit the updated lockfile.
2. Remove browser-readable access and refresh tokens from internal auth responses and client state.
3. Replace CI `ssh-keyscan` with a pinned `VPS_KNOWN_HOSTS` secret.
4. Replace public MQTT credentials with scoped short-lived credentials and strict broker ACLs.
5. Add Origin/Referer and CSRF validation to cookie-mutating auth route handlers.
6. Decide whether `/intro` is a real access boundary; if yes, enforce it server-side.
7. Add CSP and narrow the rich HTML sanitizer policy.
8. Tighten proxy/session validation and backend file deletion validation.
9. Update `.gitignore` for `.env*` hygiene.
