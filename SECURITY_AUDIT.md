# Security Audit Report

**Generated:** 2026-05-20  
**Scanner:** `.claude/agents/security-vulnerability-scanner.md`  
**Scope:** Full frontend repository static security review covering auth/session, OAuth/CSRF, XSS/injection, API access control, dependencies, CI/CD, Docker, MQTT, and video/third-party surfaces.  
**Method:** 4 parallel security sub-agent scans + local validation. Restricted files were not read: `supersecrets.txt`, `credentials.json`, `.env`, `.env.local`.

---

## Executive Summary

| Category | Issues Found | Critical | High | Medium | Low |
| -------- | ------------ | -------- | ---- | ------ | --- |
| Total    | 17           | 1        | 5    | 9      | 2   |

### Highest-Priority Findings

1. `sanitize-html@2.17.0` is affected by CVE-2026-44990 / GHSA-rpr9-rxv7-x643 and is used in trusted HTML rendering paths.
2. HttpOnly auth tokens are re-exposed to client JavaScript through internal auth JSON responses and Zustand memory.
3. JSON-LD uses raw `JSON.stringify()` inside `dangerouslySetInnerHTML`, allowing stored script-breakout XSS from API-controlled titles/names.
4. Public MQTT credentials are bundled into the browser and Docker image via `NEXT_PUBLIC_MQTT_*`.
5. `axios@1.13.2` is affected by CVE-2026-42041 / GHSA-w9j2-pvgh-6h63.
6. Public discussion hydration may expose full profile fields through comment/review author DTOs.

---

## Critical Vulnerabilities

### 1. `sanitize-html@2.17.0` XSS Bypass via `xmp` Raw-Text Passthrough

**Severity:** Critical  
**Type:** CWE-79, Cross-Site Scripting  
**OWASP:** A03:2021 - Injection  
**Locations:** `package.json:67`, `yarn.lock`, `src/utils/sanitize.util.ts:1`, `src/utils/sanitize.util.ts:4`, `src/utils/sanitize.util.ts:18`, `src/utils/sanitize.util.ts:236`  
**Evidence:** Dependency audit reports GHSA-rpr9-rxv7-x643 / CVE-2026-44990 for `sanitize-html@2.17.0`. The application uses `sanitize-html` before rendering API-controlled descriptions through `dangerouslySetInnerHTML`.

**Impact:** Attacker-controlled HTML passed through `sanitizeText()` or `stripHtml()` can survive sanitization as executable markup if rendered as trusted HTML.

**Remediation:** Upgrade or patch `sanitize-html` as soon as a fixed release is available. Until then, explicitly add `xmp` to `nonTextTags`, avoid vulnerable raw-text discard behavior, and add regression tests for `<xmp><script>...` payloads.

**Effort:** Quick to Moderate

---

## High Vulnerabilities

### 2. HttpOnly Session Tokens Re-Exposed to Client JavaScript

**Severity:** High  
**Type:** CWE-922 / CWE-200, Sensitive Information Exposure  
**OWASP:** A02:2021 - Cryptographic Failures, A07:2021 - Identification and Authentication Failures  
**Locations:** `src/app/api/auth/session/route.ts:8-13`, `src/app/api/auth/login/route.ts:37-63`, `src/app/api/auth/login/google/route.ts:20-45`, `src/app/api/auth/refresh-token/route.ts:39-66`, `src/components/providers/app-provider/app-provider.tsx:53-57`

**Evidence:**

```ts
return NextResponse.json({
  data: {
    accessToken: accessTokenCookie
  }
});
```

Login, Google login, and refresh routes also return `data: res`, which includes token fields already stored as HttpOnly cookies. `AppProvider` copies `session.accessToken` into Zustand state.

**Impact:** Any XSS, malicious browser extension, or compromised first-party script can call `/api/auth/session` or inspect auth responses and steal bearer tokens. This defeats the main security value of HttpOnly cookies.

**Remediation:** Do not return access or refresh tokens in JSON. Keep tokens exclusively in HttpOnly cookies or server-side session storage. Return only `{ result: true }` or safe session/profile metadata.

**Effort:** Moderate

### 3. JSON-LD Script Injection via Raw `JSON.stringify()`

**Severity:** High  
**Type:** CWE-79, Stored XSS  
**OWASP:** A03:2021 - Injection  
**Locations:** `src/components/seo/json-ld.tsx:7-10`, `src/components/seo/breadcrumb-list-json-ld.tsx:23-26`, `src/components/seo/breadcrumb-list-json-ld.tsx:57-61`  
**Data Flow:** API-controlled values from movie/person/category/watch pages flow into JSON-LD objects, including `movie.title`, `movie.originalTitle`, actor/director names, category names, and movie names.

**Evidence:**

```tsx
<script
  type='application/ld+json'
  dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
/>
```

**Impact:** If a stored title/name contains `</script><script>...</script>`, `JSON.stringify()` does not make the value safe for a script element. The browser can terminate the JSON-LD script and execute injected JavaScript.

**Remediation:** Serialize JSON-LD with script-context escaping. Replace `<`, `>`, `&`, U+2028, and U+2029 after `JSON.stringify()`, or use a safe serializer such as `serialize-javascript` with JSON mode.

**Effort:** Quick

### 4. Public MQTT Credentials Bundled into Client and Docker Image

**Severity:** High  
**Type:** CWE-798 / CWE-200, Hardcoded or Exposed Credentials  
**OWASP:** A05:2021 - Security Misconfiguration  
**Locations:** `src/config.ts:13-15`, `src/lib/mqtt.ts:13-15`, `Dockerfile:26-40`, `.github/workflows/docker.yml:40-42`, `.github/workflows/docker.yml:94-96`

**Evidence:**

```ts
client = mqtt.connect(envConfig.NEXT_PUBLIC_MQTT_BROKER as string, {
  username: envConfig.NEXT_PUBLIC_MQTT_USERNAME as string,
  password: envConfig.NEXT_PUBLIC_MQTT_PASSWORD as string
});
```

**Impact:** Anyone loading the frontend can extract broker credentials from the JavaScript bundle. If broker ACLs are weak, attackers can subscribe to account notification topics or publish spoofed notifications.

**Remediation:** Do not ship shared static MQTT credentials in `NEXT_PUBLIC_*`. Issue short-lived per-user MQTT tokens server-side, enforce broker ACLs per user/topic, and avoid passing secrets through Docker build args.

**Effort:** Moderate to Extensive

### 5. `axios@1.13.2` Auth/Error Handling Bypass Gadget

**Severity:** High  
**Type:** CWE-1321 / CWE-287, Prototype Pollution Impact on Auth/Error Handling  
**OWASP:** A07:2021 - Identification and Authentication Failures, A06:2021 - Vulnerable and Outdated Components  
**Locations:** `package.json:39`, `yarn.lock`

**Evidence:** Dependency audit reports GHSA-w9j2-pvgh-6h63 / CVE-2026-42041 for `axios >=1.0.0 <1.15.1`.

**Impact:** If any dependency or input path pollutes `Object.prototype.validateStatus`, Axios can treat 401/403/500 responses as successful and bypass expected error handling.

**Remediation:** Upgrade Axios to `>=1.15.1` and add defensive tests around auth/API error handling.

**Effort:** Quick

### 6. Public Discussion Hydration May Expose Excessive User Data

**Severity:** High  
**Type:** CWE-200, Excessive Data Exposure  
**OWASP:** API3:2019 - Excessive Data Exposure / API3:2023 - Broken Object Property Level Authorization  
**Locations:** `src/types/comment.type.ts:11`, `src/types/review.type.ts:10`, `src/types/account.type.ts:6`, `src/app/movie/[slug]/page.tsx`, `src/app/watch/[slug]/page.tsx`

**Evidence:** `CommentResType.author`, `CommentResType.replyTo`, parent author, and `ReviewResType.author` are typed as full `ProfileResType`, which includes fields such as `email`, `phone`, `group`, `settings`, and `isMakeSurvey`. Movie/watch pages prefetch comment/review lists into client-visible hydration payloads.

**Impact:** Public pages can expose non-display user profile fields and role/group metadata even though the UI only needs public author fields.

**Remediation:** Use a public author DTO such as `{ id, username, fullName, avatarPath, kind, gender? }` for comment/review responses. Do not hydrate email, phone, settings, or group/permission fields.

**Effort:** Moderate

---

## Medium Vulnerabilities

### 7. OAuth Callback Flow Has No Visible `state` / Nonce Validation

**Severity:** Medium  
**Type:** CWE-346 / CWE-352, OAuth CSRF  
**OWASP:** A01:2021 - Broken Access Control, A07:2021 - Identification and Authentication Failures  
**Locations:** `src/app/auth/google/callback/page.tsx:13`, `src/app/(auth)/login/_components/button-login-google.tsx:89`, `src/app/api/auth/login/google/route.ts:15`

**Evidence:** The callback extracts only `code`; postMessage sends only `{ code }`; the API exchanges only `code`. No frontend `state`, nonce, or PKCE verifier handling was found.

**Impact:** If the upstream auth service does not independently bind and validate state, attackers can perform OAuth login CSRF/account confusion.

**Remediation:** Generate a high-entropy `state`, store it in an HttpOnly/SameSite cookie or server session, require it on callback, and verify it before code exchange. Use PKCE if supported.

**Effort:** Moderate

### 8. Cookie-Authenticated Auth Mutation Routes Lack CSRF Origin/Token Checks

**Severity:** Medium  
**Type:** CWE-352, CSRF  
**OWASP:** A01:2021 - Broken Access Control  
**Locations:** `src/app/api/auth/logout/route.ts:8`, `src/app/api/auth/refresh-token/route.ts:13`, `src/app/api/auth/login/google/route.ts:13`

**Evidence:** POST routes mutate authentication state using cookies and `Set-Cookie`, but do not validate `Origin`, `Referer`, `Sec-Fetch-Site`, or CSRF tokens.

**Impact:** `SameSite=Lax` reduces classic cross-site POST CSRF, but explicit request provenance checks are still missing for same-site subdomain attacks, sibling app compromise, and future cookie policy regressions.

**Remediation:** Add centralized CSRF validation for auth mutation routes. Require same-origin `Origin`, reject cross-site `Sec-Fetch-Site`, and use a CSRF token for state-changing requests.

**Effort:** Quick to Moderate

### 9. Path Parameter Injection from Unencoded Replacement

**Severity:** Medium  
**Type:** CWE-20 / CWE-116, Improper Input Validation / Output Encoding  
**OWASP:** A03:2021 - Injection  
**Location:** `src/utils/http.util.ts:185-187`

**Evidence:**

```ts
Object.entries(pathParams).forEach(([key, value]) => {
  baseUrl = baseUrl.replace(`:${key}`, value.toString());
});
```

**Impact:** If a path parameter contains `/`, `?`, `#`, or encoded delimiter variants, it can alter the outbound API path/query rather than being treated as an opaque ID.

**Remediation:** Encode replacements with `encodeURIComponent(String(value))` and validate expected ID shapes before API calls.

**Effort:** Quick to Moderate

### 10. Profile Update Trusts Client-Supplied Account Identity and Immutable Fields

**Severity:** Medium  
**Type:** CWE-639 / CWE-915, IDOR / Mass Assignment  
**OWASP:** API1:2023 - Broken Object Level Authorization, API6:2023 - Unrestricted Access to Sensitive Business Flows  
**Locations:** `src/schemaValidations/account.schema.ts:3`, `src/app/account/profile/_components/profile-form.tsx:61`, `src/api-requests/account.api-request.ts:8`

**Evidence:** `updateProfileSchema` requires `id` and accepts `email`. The form initializes `id` from `profile.id`, disables email only in the UI, and posts the whole body to `/v1/user/update-profile`.

**Impact:** If the backend trusts `body.id` or accepts `email`, a tampered request can attempt cross-account updates or mutate fields the UI intended to keep immutable.

**Remediation:** Backend should derive user identity from the token and ignore/reject `id`. Frontend should remove `id` and immutable `email` from the update body.

**Effort:** Moderate

### 11. Comment Update Body Allows Relationship Mass Assignment

**Severity:** Medium  
**Type:** CWE-915, Mass Assignment  
**OWASP:** API6:2023 - Unrestricted Access to Sensitive Business Flows  
**Locations:** `src/schemaValidations/comment.schema.ts:3`, `src/components/app/comment/comment-form.tsx:108`, `src/api-requests/comment.api-request.ts:26`

**Evidence:** The same `CommentBodyType` is used for create and update, accepting `movieId`, `movieItemId`, `parentId`, `replyToId`, and `replyToKind`. Update sends `{ ...values, id: editingComment.id }`.

**Impact:** A tampered update request can try to re-parent a comment, move it to another movie/item, or alter reply targeting if the backend does not restrict updateable fields to `content`.

**Remediation:** Use separate create/update schemas. Update should accept only `{ id, content }`, with ownership and relationship immutability enforced server-side.

**Effort:** Moderate

### 12. `axios` / `follow-redirects` Can Leak Custom Auth Headers on Cross-Domain Redirects

**Severity:** Medium  
**Type:** CWE-200, Sensitive Information Exposure  
**OWASP:** A02:2021 - Cryptographic Failures, A06:2021 - Vulnerable and Outdated Components  
**Locations:** `package.json:39`, `yarn.lock`

**Evidence:** `axios@1.13.2` depends on `follow-redirects@1.15.11`; dependency audit reports GHSA-r4q5-vmmm-2653 for `follow-redirects <=1.15.11`.

**Impact:** Server-side Axios calls using custom auth headers could forward those headers to attacker-controlled redirect targets.

**Remediation:** Upgrade `follow-redirects` to `>=1.16.0` through Axios/lockfile resolution. Disable redirects or strip custom sensitive headers when calling untrusted URLs.

**Effort:** Quick

### 13. MQTT Transitive `ws@8.20.0` Uninitialized Memory Disclosure

**Severity:** Medium  
**Type:** CWE-908, Uninitialized Resource  
**OWASP:** A06:2021 - Vulnerable and Outdated Components  
**Locations:** `package.json:53`, `yarn.lock`

**Evidence:** `mqtt@5.15.1` depends on `ws@8.20.0`; dependency audit reports GHSA-58qx-3vcg-4xpx / CVE-2026-45736, fixed in `ws@8.20.1`.

**Impact:** Practical exploitability appears low in this frontend context, but the runtime dependency tree includes a vulnerable WebSocket implementation.

**Remediation:** Upgrade `mqtt` when it resolves `ws >=8.20.1`, or add a Yarn `resolutions` override for `ws@8.20.1+`.

**Effort:** Quick

### 14. CI/CD Supply-Chain Hardening Gaps in Privileged Deploy Workflow

**Severity:** Medium  
**Type:** CWE-829, Inclusion of Functionality from Untrusted Control Sphere  
**OWASP:** A08:2021 - Software and Data Integrity Failures  
**Locations:** `.github/workflows/docker.yml:13`, `.github/workflows/docker.yml:16`, `.github/workflows/docker.yml:19`, `.github/workflows/docker.yml:25`

**Evidence:** GitHub Actions are pinned by mutable tags such as `@v4`, `@v3`, and `@v6` instead of full commit SHAs. The workflow also has no explicit top-level `permissions`.

**Impact:** A compromised or retagged third-party action could run in the deployment pipeline with access to Docker, VPN, SSH, and Discord secrets.

**Remediation:** Pin actions to full commit SHAs and set least-privilege `permissions`, typically `contents: read` unless more is required.

**Effort:** Moderate

### 15. Docker Base/Image Tags Are Mutable and Production Deploys `latest`

**Severity:** Medium  
**Type:** CWE-1104, Use of Unmaintained or Mutable Third-Party Components  
**OWASP:** A06:2021 - Vulnerable and Outdated Components  
**Locations:** `Dockerfile:2`, `Dockerfile:10`, `Dockerfile:45`, `.github/workflows/docker.yml:30`, `.github/workflows/docker.yml:48`, `.github/workflows/docker.yml:81`, `.github/workflows/docker.yml:97`

**Evidence:** `FROM node:20-alpine` is not digest-pinned and deployment pulls `${DOCKER_USERNAME}/fe-moviehub:latest`.

**Impact:** Builds and deploys are not reproducible. Upstream tag changes can introduce vulnerable base layers or unexpected runtime changes.

**Remediation:** Pin base images by digest and deploy immutable image tags such as commit SHA or release version.

**Effort:** Moderate

---

## Low Vulnerabilities

### 16. Security Headers Are Incomplete

**Severity:** Low  
**Type:** CWE-693 / CWE-1021, Security Misconfiguration  
**OWASP:** A05:2021 - Security Misconfiguration  
**Location:** `next.config.ts:47`

**Evidence:** Headers include `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `X-Robots-Tag`, and HSTS, but no `Content-Security-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, or `Cross-Origin-Resource-Policy`.

**Impact:** Missing CSP materially increases the impact of XSS. Missing permissions and cross-origin policies leave avoidable browser attack surface.

**Remediation:** Add a CSP with constrained `default-src`, `script-src`, `connect-src`, `img-src`, and `frame-ancestors`. Add `Permissions-Policy`, COOP, and CORP where compatible.

**Effort:** Moderate

### 17. Client-Side Upload Validation Is MIME-Only and Has No Default Size Limit

**Severity:** Low  
**Type:** CWE-434, Unrestricted File Upload  
**OWASP:** A05:2021 - Security Misconfiguration  
**Locations:** `src/components/form/upload-image-field.tsx:180-191`, `src/hooks/use-file-upload.ts:87-118`, `src/app/account/profile/_components/profile-form.tsx:134-138`

**Evidence:** `useFileUpload({ accept: 'image/*' })` uses browser MIME checks and defaults `maxSize` to `Infinity`.

**Impact:** Users can select very large files and browser-provided MIME types can be spoofed. This increases DoS/storage risk if backend validation is weak.

**Remediation:** Add frontend size limits and extension/MIME allowlists for UX. Enforce authoritative backend validation: max bytes, decoded image verification, extension normalization, content sniffing, and safe storage names.

**Effort:** Moderate

---

## Positive Security Patterns Found

| Pattern                                           | File                                                                                                                   | Notes                                                                                |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| HttpOnly cookie flags present                     | `src/app/api/auth/login/route.ts`, `src/app/api/auth/login/google/route.ts`, `src/app/api/auth/refresh-token/route.ts` | Cookies use `httpOnly`, `sameSite: 'lax'`, `path: '/'`, and production-only `secure` |
| Baseline security headers present                 | `next.config.ts`                                                                                                       | HSTS, frame denial, MIME sniffing protection, and referrer policy are configured     |
| Container drops root privileges                   | `Dockerfile`                                                                                                           | Runtime stage uses non-root `nextjs` user                                            |
| HTML descriptions usually sanitized before render | `src/utils/sanitize.util.ts`, movie/person/slider components                                                           | `sanitizeText()` is used before many `dangerouslySetInnerHTML` sinks                 |
| Google message receiver validates origin          | `src/app/(auth)/login/_components/button-login-google.tsx`                                                             | `event.origin` is checked before accepting the callback code                         |
| Route protection exists for private pages         | `src/proxy.ts`                                                                                                         | `/account`, `/survey`, and `/user` are gated by auth cookie presence                 |

---

## False Positives / Removed Stale Findings

- Direct token persistence to `localStorage` was not found in the current code. Token exposure is through JSON responses and Zustand memory, not durable `localStorage` token storage.
- A previous “missing all security headers” finding is stale. Baseline headers now exist; remaining gap is missing CSP/Permissions-Policy/COOP/CORP.
- Video/VTT URLs were reviewed and not classified as a concrete third-party script execution issue because they are passed to media/caption sinks and appear intentional.
- Docker root execution was ruled out because the runtime image uses a non-root `nextjs` user.
- `minimatch@10.1.1` ReDoS advisory appears build/tooling-only through `rimraf -> glob`; it was not prioritized as deployed runtime exposure.
- Login redirect reuse was not classified as an open redirect in the reviewed flow because the stored redirect path is set from `window.location.pathname`, not a full external URL.
- Search/query params are URL-encoded before navigation in the reviewed flow.

---

## Prioritized Remediation Plan

### Phase 1 - Immediate

- [ ] Patch or mitigate `sanitize-html` CVE-2026-44990 and add XSS regression tests.
- [ ] Stop returning access/refresh tokens from internal auth APIs and remove token copying into Zustand.
- [ ] Escape JSON-LD serialization before inserting it into `<script type="application/ld+json">`.
- [ ] Upgrade `axios` to `>=1.15.1` and refresh the lockfile.

### Phase 2 - Soon

- [ ] Replace public static MQTT credentials with short-lived per-user broker credentials and ACLs.
- [ ] Add OAuth `state` validation and PKCE/nonce support where available.
- [ ] Add CSRF origin/token validation for auth mutation routes.
- [ ] Replace full discussion author/profile DTOs with public-safe DTOs.
- [ ] Encode and validate `pathParams` in `src/utils/http.util.ts`.

### Phase 3 - Hardening

- [ ] Remove client-controlled `id` and immutable fields from profile update payloads.
- [ ] Split comment create/update schemas and restrict update to `{ id, content }`.
- [ ] Upgrade or override `follow-redirects` and `ws` vulnerable transitive dependencies.
- [ ] Pin GitHub Actions and Docker base images to immutable SHAs/digests.
- [ ] Deploy immutable image tags instead of `latest`.
- [ ] Add CSP, Permissions-Policy, COOP, and CORP.
- [ ] Add explicit upload size/type validation in the frontend and verify backend enforcement.

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

- This is a frontend/static review. IDOR and mass-assignment risks require backend enforcement to fully fix.
- Dependency findings reflect the advisories reported during the scan on 2026-05-20.
- Restricted secret files were intentionally excluded from review.
