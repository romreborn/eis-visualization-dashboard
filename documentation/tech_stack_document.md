# Tech Stack Document: EIS Visualization Dashboard

This document explains, in everyday language, why we chose each technology for your Executive Information System (EIS) visualization dashboard. It should help anyone—technical or not—understand how the pieces fit together and why they matter.

## Frontend Technologies

We built the user-facing side of the dashboard using modern, easy-to-work-with tools that make it fast, reliable, and pleasant to look at.

- **Next.js (App Router)**  
  A React-based framework that handles routing and server-side rendering. It keeps sensitive API details hidden from users while letting us fetch data securely on the server.

- **TypeScript**  
  A superset of JavaScript that adds type checking. This means we catch mistakes early, such as mismatched data fields, which leads to fewer runtime bugs.

- **Tailwind CSS & CSS Variables**  
  A utility-first styling system plus customizable variables for colors, fonts, and spacing. It lets us build custom-branded layouts quickly and support both light and dark modes out of the box.

- **shadcn/ui**  
  A library of pre-built, accessible React components (tables, forms, modals, etc.). It ensures a consistent look and feel and speeds up development by avoiding one-off component design.

- **Better Auth**  
  A lightweight, file-based authentication library for user sign-up, login, and session handling. It’s perfect if you want the dashboard to manage its own users, or it can be swapped for a JWT-based flow if you prefer to integrate with your existing ASP.NET identity.

- **Charting & Mapping Libraries**  
  - **Recharts** or **Chart.js** for bar charts, pie charts, and line graphs.  
  - **Leaflet** or **Mapbox** for interactive maps plotting circuit endpoints.
  These are optional but highly recommended for clear data visualization.

- **Zod** (optional)  
  A runtime data validation library. It checks that the data coming from your API matches what our components expect before rendering anything.

- **Vitest & React Testing Library** (optional)  
  A testing setup for checking that components render correctly and data-shaping functions work as intended.

## Backend Technologies

The dashboard relies on your existing data and business logic, so we tap into your ASP.NET C# backend and SQL Server database.

- **ASP.NET Core (C#)**  
  Hosts a secure REST API endpoint (e.g., `/api/circuits/report`) that runs your complex SQL Server query and returns the results as JSON.

- **SQL Server**  
  Your primary data store where circuit records live. The API controller in C# executes the SQL query and serializes results.

- **Drizzle ORM** (optional)  
  Included as an example data layer if you ever connect directly from Next.js to a database. In your scenario, we recommend calling your ASP.NET API instead, so Drizzle stays unused or serves as a reference.

- **JWT Tokens / Token-Based Auth**  
  If you integrate login with your ASP.NET identity, the API can issue a token at login. Next.js will forward that token on each request to prove the user is authenticated.

## Infrastructure and Deployment

These choices make it easy to develop, test, and deploy the dashboard, while keeping it reliable and scalable.

- **Git & GitHub**  
  Version control for tracking every change. GitHub acts as the central code repository and collaboration hub.

- **Docker**  
  Containerizes the Next.js app so it runs the same way everywhere—locally, in testing, or in production.

- **Vercel**  
  A hosting platform built for Next.js. It offers automatic builds, global edge delivery, and simple environment variable management. Alternatively, you can host the Docker container on your own infrastructure or cloud provider.

- **CI/CD (Continuous Integration / Continuous Deployment)**  
  When you push changes to GitHub, tests run automatically (Vitest, linter checks), and Vercel can deploy the updated dashboard without manual intervention.

## Third-Party Integrations

We integrate a few external services and libraries to add features without reinventing the wheel.

- **Better Auth**  
  Handles user authentication securely.

- **Recharts / Chart.js**  
  Renders interactive charts for your circuit metrics.

- **Leaflet / Mapbox**  
  Displays circuit endpoints and paths on a map for spatial analysis.

- **Swagger / OpenAPI** (optional)  
  Documents your ASP.NET API contract so frontend and backend teams agree on data formats.

## Security and Performance Considerations

We’ve built in safeguards and optimizations to keep your data safe and the dashboard snappy.

- **Server-Side Data Fetching**  
  Next.js server components call your API, hiding keys and URLs from the browser and reducing attack surface.

- **Type Safety**  
  TypeScript plus Zod ensures that only correctly shaped data reaches your components, preventing unexpected errors.

- **Token-Based Authentication**  
  JWT tokens or Better Auth sessions secure API calls and protect sensitive data.

- **Code Splitting & Caching**  
  Next.js automatically splits code by page and caches static assets at the edge, resulting in faster load times.

- **HTTP Security Headers**  
  Vercel can inject industry-standard headers (CSP, HSTS, etc.) to guard against common web attacks.

## Conclusion and Overall Tech Stack Summary

We’ve chosen a modern, modular set of tools that work together to deliver a secure, high-performance dashboard:

- Frontend: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Better Auth
- Backend: ASP.NET Core (C#), SQL Server, REST API, optional Drizzle ORM
- Deployment: GitHub, Docker, Vercel, CI/CD pipelines
- Visualizations: Recharts/Chart.js, Leaflet/Mapbox
- Quality & Security: Zod, Swagger/OpenAPI, testing libraries, security headers

These technologies align perfectly with your goal: a clean, maintainable visualization layer on top of your existing EIS, ensuring executives and analysts get fast, interactive insights without compromising security or slowing down development. Feel free to adapt or extend any part of this stack as your needs evolve.