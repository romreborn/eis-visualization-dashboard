# Executive Information System (EIS) Visualization Dashboard – Security Guidelines

This document outlines the security best practices and requirements for the EIS Visualization Dashboard codebase. It is organized around established security principles and tailored to the Next.js/Tailwind/Better Auth boilerplate described.

---

## 1. Security by Design

•  Embed security from day one. Every new component, API, or configuration change must consider potential threats.
•  Perform threat modeling when introducing new features (e.g., interactive map, chart components).
•  Keep business logic (data fetching, sensitive operations) on the server–side using Next.js server components to minimize client exposure.

## 2. Authentication & Access Control

### 2.1 Implement Robust Authentication
•  If using Better Auth as a standalone solution:
   - Enforce strong password policies (minimum length, complexity, rotation if required).
   - Use bcrypt or Argon2 with per-user salts for password hashing.
•  If integrating with existing ASP.NET identity:
   - Adopt JWT tokens signed with a strong key (HS256 or RS256).
   - Validate `alg`, `iss`, `aud`, and `exp` claims on each request.

### 2.2 Secure Session Management
•  Generate unpredictable session identifiers.
•  Store session IDs in `HttpOnly`, `Secure`, `SameSite=Strict` cookies.
•  Enforce idle and absolute timeouts; implement logout and session revocation.
•  Protect against session fixation by rotating session IDs on privilege changes.

### 2.3 Role-Based Access Control (RBAC)
•  Define minimal roles (e.g., Admin, Analyst, Viewer).
•  Enforce permission checks on each server route (`/app/dashboard/*`).
•  Reject unauthorized attempts with HTTP 403; never expose sensitive payloads.

## 3. Input Validation & Output Encoding

•  Treat all user input (query params, request bodies) as untrusted.
•  On the Next.js server, validate API responses using a schema library (e.g., Zod) to ensure data conforms to expected types.
•  Sanitize any dynamic UI output (chart labels, table cells) with React’s built-in escaping or a trusted encoder.
•  Use parameterized queries or sanitized queries on ASP.NET endpoints to prevent SQL injection.

## 4. Data Protection & Privacy

### 4.1 Encryption In Transit & At Rest
•  Enforce HTTPS (TLS 1.2+) for all client–server and server–server communication.
•  Store environment secrets and API keys only in secure vaults or encrypted environment variables.

### 4.2 Secret Management
•  Do **not** hardcode credentials in code or `.env` files stored in source control.
•  Use a secrets manager (e.g., Azure Key Vault, AWS Secrets Manager) and fetch at build/deploy time.

### 4.3 Data Minimization & Masking
•  Only return required fields (`CircuitID`, `Status`, etc.) in API responses.
•  Mask or hash any PII fields before sending to the client.

## 5. API & Service Security

•  Expose only necessary endpoints (`/api/circuits/report`), and version them.
•  Implement rate limiting and request throttling on the ASP.NET API to protect against DoS.
•  Restrict CORS to known origins (e.g., your corporate dashboard URL).
•  Validate redirect URIs against an allow-list if using any OAuth or post-login redirects.

## 6. Web Application Security Hygiene

### 6.1 CSRF Protection
•  Enable CSRF tokens (synchronizer token pattern) for all state-changing forms and API calls.

### 6.2 Security Headers
Add or enforce via Next.js middleware or hosting platform:
   - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
   - `Content-Security-Policy`: limit scripts, styles, and frame sources to trusted origins.
   - `X-Frame-Options: DENY` or equivalent CSP directive to prevent clickjacking.
   - `X-Content-Type-Options: nosniff` to prevent MIME-based attacks.
   - `Referrer-Policy: strict-origin-when-cross-origin`

### 6.3 Secure Cookies
•  Always use `Secure`, `HttpOnly`, `SameSite=Strict`.
•  Do not store sensitive tokens in `localStorage` or `sessionStorage`.

### 6.4 Subresource Integrity (SRI)
•  If loading any third-party scripts or styles, use SRI hashes to ensure integrity.

## 7. Infrastructure & Configuration Management

•  Harden Docker images:
   - Use minimal base images (e.g., `node:18-alpine`).
   - Run the Next.js process as a non-root user.
•  Disable debug and verbose logging in production.
•  Regularly update OS, Node.js, and all libraries to patch vulnerabilities.
•  Limit exposed ports to only those necessary (e.g., 80/443).

## 8. Dependency Management

•  Maintain and commit a lockfile (`package-lock.json`).
•  Use an SCA tool (e.g., npm audit, Snyk) integrated into CI to detect CVEs.
•  Periodically review and update dependencies; remove unused packages to reduce attack surface.

## 9. Monitoring, Logging & Incident Response

•  Log authentication failures, authorization denials, and critical errors with minimal sensitive data.
•  Centralize logs in a secure, tamper-resistant system (e.g., ELK stack, Splunk).
•  Implement alerts for repeated failed logins or unusual API activity.
•  Define and test an incident response plan for data breaches or service compromises.

## 10. Testing & Validation

•  Write automated unit tests (Vitest) for data-transformation functions and permission logic.
•  Perform static analysis (ESLint, TypeScript) and security linting (npm audit).
•  Conduct periodic security reviews and penetration tests, especially before major releases.

---

Adhering to these guidelines will ensure the EIS Visualization Dashboard remains secure, reliable, and compliant with industry best practices. Regularly revisit and update these controls as your application and threat landscape evolve.