# Project Requirements Document (PRD)

## 1. Project Overview

We are building an **Executive Information System (EIS) Visualization Dashboard** as a standalone Next.js application. Its main goal is to provide decision-makers with a modern, interactive interface to view, explore, and analyze complex network circuit data fetched from your existing ASP.NET C# backend. Instead of wrestling with raw SQL outputs or static reports, executives will have a dynamic table view, charts, and (eventually) map visualizations that surface critical metrics like circuit status, service type, partner distribution, and geographic endpoints.

This dashboard will streamline the process of monitoring and exploring circuit health, capacity, and deployment by decoupling the visualization layer from the legacy ASP.NET monolith. Key success criteria include secure access control, sub-second page loads for typical queries, a responsive UI with light/dark mode, and a seamless integration path—either embedded or linked—from your main application. By delivering this boilerplate, we empower your team to focus on advanced visualizations and business logic rather than boilerplate setup.

## 2. In-Scope vs. Out-of-Scope

### In-Scope (Version 1.0)
- User authentication (registration, login, session management) via **Better Auth** or token-based JWT flow.
- Protected dashboard route under `/app/dashboard` with server-side data fetching.
- Interactive data table showing SQL query results (`CircuitID`, `CustDesc`, `Status`, `ServiceType`, `Partner`, `RemRegion`, etc.).
- Basic charts (bar, pie) using shadcn/ui components for key metrics.
- Light and dark theme toggle via CSS variables.
- Data fetching layer in `/lib` using `fetch` to call a secure ASP.NET C# API endpoint that returns JSON.
- Environment variable configuration for API base URL and authentication secrets.
- Containerized Docker support and optional Vercel deployment config.

### Out-of-Scope (Later Phases)
- Interactive map visualization (Leaflet/Mapbox) – placeholder only.
- Advanced filtering, sorting, and pagination on large datasets.
- Role-based access control beyond basic authenticated vs. unauthenticated.
- Export to PDF/Excel or scheduled email reports.
- Mobile-first layout or native mobile app.
- ML-driven anomaly detection or AI summarization.
- Detailed audit logging, compliance (e.g., GDPR consent flows), or multi-tenant support.

## 3. User Flow

A new user arrives at the dashboard URL. They land on the **sign-in** page where they can register or log in with an email and password. Upon successful authentication, the user is redirected to the **Dashboard Home**. The layout features a left sidebar for navigation (currently with “Dashboard” as the primary link) and a top bar with a theme toggle and user menu. No API keys or backend secrets ever reach the browser; all data calls are performed server-side.

Once inside the dashboard, the user immediately sees a **Data Table** displaying the latest circuit records fetched from the ASP.NET API. Above the table, small summary cards show total circuits, active vs. inactive counts, and service-type breakdowns. The user can switch between table and chart views via tabs. In chart view, bar charts categorize circuits by partner or region, and pie charts break down status counts. All UI elements adapt to light or dark mode instantly.

## 4. Core Features

- **Authentication Module**: Sign up, log in, log out, session handling (Better Auth or JWT).  
- **Protected Dashboard Route**: Server-side check of authentication before rendering.  
- **Data Fetching Layer**: `/lib/fetchCircuits.ts` calls `GET /api/circuits/report` on the C# backend, parses JSON, returns typed data.  
- **Data Table Component**: Reusable table with sortable columns, configurable via props.  
- **Chart Components**: Bar and pie chart containers using shadcn/ui (or Chart.js under the hood).  
- **Theming**: Light/dark toggle via Tailwind CSS and CSS variables.  
- **Environment Config**: `.env.local` for `API_BASE_URL`, `AUTH_SECRET`, etc.  
- **Deployment Setup**: `Dockerfile` and `docker-compose.yml`; Vercel config file.  

## 5. Tech Stack & Tools

**Frontend**  
- Next.js (App Router) for server components and routing.  
- React + TypeScript for type safety.  
- Tailwind CSS + CSS Variables for rapid styling and theming.  
- shadcn/ui for accessible, pre-built UI components.  
- Better Auth (file-based) or custom JWT approach for auth.

**Backend**  
- Existing ASP.NET Core Web API (C#) exposing `/api/circuits/report`.  
- SQL Server database with circuit data.  
- Swagger/OpenAPI for API contract definition.

**Tools & Libraries**  
- Zod for runtime data validation of API responses.  
- Vitest + React Testing Library for unit and component tests.  
- Docker & docker-compose for local development and on-premise deployment.  
- Vercel for optional cloud hosting.

**IDE/Editor Integrations**  
- VS Code with ESLint, Prettier, Tailwind IntelliSense.  
- Optional plugin: Windsurf for AI-assisted code completion.

## 6. Non-Functional Requirements

- **Performance**: Initial dashboard load under 1 second for up to 1,000 records.  
- **Scalability**: Ability to handle pagination or server streaming if record counts exceed 10,000.  
- **Security**: All API calls from server to server; no secrets exposed in the frontend. HTTPS only. JWT or secure cookie flagged HttpOnly.  
- **Reliability**: Uptime of 99.5% SLA when deployed via Vercel or container cluster.  
- **Usability**: WCAG 2.1 AA compliance for color contrast and keyboard navigation.  
- **Maintainability**: 80% code coverage for critical data-transformation functions and core components.

## 7. Constraints & Assumptions

- The ASP.NET Core API endpoint (`/api/circuits/report`) exists or will be created before frontend integration.  
- Environment variables (`API_BASE_URL`, auth secrets) are correctly set in each environment.  
- Better Auth library remains supported or a JWT alternative can be implemented.  
- The circuit data JSON schema matches the agreed OpenAPI contract.  
- Next.js 14+ and Node.js 18+ are available in dev and production.  
- No third-party rate limits on the internal API; if they exist, caching or pagination will be required.

## 8. Known Issues & Potential Pitfalls

- **Data Shape Mismatch**: If the C# API changes the JSON schema, the dashboard will break at runtime. Mitigation: use Zod schemas and enforce OpenAPI validation on the backend.
- **Large Datasets**: Rendering thousands of rows in one table can kill performance. Mitigation: implement server-side pagination or infinite scrolling.
- **Authentication Integration**: Swapping Better Auth for JWT requires consistent token issuance and refresh flows. Mitigation: define clear token-exchange endpoints and lifetimes ahead of time.
- **Cross-Origin Requests**: The Next.js server must whitelist the API host. Ensure CORS policies allow server-to-server calls.  
- **Container Ports & Networking**: Docker networking in local dev may conflict with existing services. Mitigation: document required ports in `docker-compose.yml` and allow overrides.

---

This PRD covers all essential details for an AI model to generate subsequent technical documents—Tech Stack Doc, Frontend Guidelines, Backend Structure, App Flow, File Structure, IDE Rules, and more—without ambiguity.