# Frontend Guideline Document

This document outlines the frontend setup for the Executive Information System (EIS) visualization dashboard. It covers architecture, design principles, styling, components, state handling, routing, performance, testing, and a final summary.

---

## 1. Frontend Architecture

### 1.1 Overview
- **Framework:** Next.js (App Router) for file-based routing, server-side rendering, and server components.  
- **Language:** TypeScript to catch errors early and define clear contracts with your backend.  
- **UI Library:** shadcn/ui for accessible, ready-made React components.  
- **Styling:** Tailwind CSS plus CSS variables, giving a utility-first approach and easy theming.  
- **Authentication:** Better Auth for file-based login, easily swapped for JWT-based auth from your existing ASP.NET system.  
- **Deployment:** Docker setup for self-hosted containers and Vercel support for zero-config cloud deployments.

### 1.2 How It Supports Scalability, Maintainability, and Performance
- **Scalability:** Next.js server components let you fetch data securely on the server. You can scale the dashboard separately from your main backend by deploying it as its own service.  
- **Maintainability:** Component-based structure (see Section 4) keeps UI pieces small, focused, and reusable. TypeScript enforces consistent data shapes, cutting down on bugs.  
- **Performance:** Built-in code splitting and automatic image and asset optimization. Tailwind’s “purge” removes unused CSS from production builds.

---

## 2. Design Principles

### 2.1 Key Principles
- **Usability:** Simple, straightforward layouts. Data tables and charts are clear and labeled.  
- **Accessibility:** shadcn/ui components follow WAI-ARIA guidelines; color contrasts meet WCAG AA standards.  
- **Responsiveness:** Mobile-friendly breakpoints and fluid layouts built with Tailwind.  
- **Consistency:** A unified look and feel across all screens via shared CSS variables and component library.

### 2.2 Applying Principles to UI
- Navigation, tables, and charts all adapt to small screens.  
- Buttons, links, and form fields have consistent padding, font sizes, and color feedback on hover/focus.  
- Keyboard navigation and screen-reader labels are built in by default in shadcn/ui components.

---

## 3. Styling and Theming

### 3.1 Styling Approach
- **Tailwind CSS:** Utility classes for margins, padding, colors, typography, and layout.  
- **CSS Variables:** Define your color palette and spacing in `:root` so you can switch themes easily.  
- **Pre-processor:** No extra preprocessors; Tailwind’s JIT compiler handles everything.

### 3.2 Theming
- Two built-in modes: **light** and **dark**.  
- Theme is toggled via a React Context (see Section 5) and stored in `localStorage` so user preference persists.  

### 3.3 Visual Style
- **Style:** Modern flat design with subtle glassmorphism touches on modals and cards.  
- **Color Palette:**  
  • Primary: #1F2937 (dark slate)  
  • Accent: #3B82F6 (blue)  
  • Success: #10B981 (green)  
  • Warning: #F59E0B (amber)  
  • Error: #EF4444 (red)  
  • Background Light: #F9FAFB  
  • Background Dark: #111827  
- **Fonts:**  
  • Headings: `Inter` (sans-serif, clean and legible)  
  • Body: `Inter` or `Roboto` for numbers in tables and charts

---

## 4. Component Structure

### 4.1 Organization
- `/app`: Pages and layouts (uses Next.js App Router).  
- `/components`: Reusable UI pieces.  
- `/lib`: Data-fetching and helper functions.  

### 4.2 Reusability
- Each component has its own folder with:
  • `index.tsx` (main component)  
  • `styles.module.css` or Tailwind classes  
  • `types.ts` if it has custom props  
- Examples:
  • **DataTable** for tabular data.  
  • **ChartArea** for bar, pie, or line charts.  
  • **MapView** for interactive circuit maps (using Leaflet or Mapbox).

### 4.3 Benefits of Component-Based Architecture
- Easier to test, document, and reuse UI pieces across the dashboard.  
- Clear separation of concerns: styling, structure, and logic live together.

---

## 5. State Management

### 5.1 Approach
- **Server Components:** Fetch data on the server via Next.js. Minimizes client-side state for data loading.  
- **Local State:** Use React’s `useState` in client components for UI interactions (filters, modal visibility).  
- **Global State:** Use React Context for cross-cutting concerns like theming or authenticated user info.

### 5.2 Data Flow
1. Server component in `app/dashboard/page.tsx` fetches circuit data from your ASP.NET API.  
2. Data is passed down as props to DataTable, ChartArea, and MapView.  
3. Child components may maintain their own local state (e.g., sorting column, hovered chart slice).

---

## 6. Routing and Navigation

### 6.1 Next.js App Router
- **File-based routing:** Create `app/dashboard/page.tsx` for the dashboard.  
- **Nested Layouts:** `layout.tsx` under `/app/dashboard` wraps all dashboard pages with auth checks and navigation bar.

### 6.2 User Flow
- **Home** → **Login** (Better Auth) → **Dashboard** → **Details** (e.g., modal or nested route for individual circuit)
- Use `<Link>` from `next/link` for client-side transitions without full page reload.  
- Protect routes by checking auth status in the layout and redirecting to `/login` if needed.

---

## 7. Performance Optimization

### 7.1 Strategies
- **Lazy Loading:** Dynamic `import()` for heavy components (e.g., MapView).  
- **Code Splitting:** Next.js automatically splits JS by route.  
- **Asset Optimization:** Built-in image optimization with `next/image`, and font optimization.  
- **CSS Purge:** Tailwind removes unused classes in production, keeping CSS bundles small.

### 7.2 Impact on User Experience
- Faster initial load, as only the code needed for the current page is sent to the browser.  
- Smooth interactions due to optimized images and minimized CSS.

---

## 8. Testing and Quality Assurance

### 8.1 Unit and Component Tests
- **Vitest:** Fast unit tests for functions in `/lib` (e.g., data transformers).  
- **React Testing Library:** Verify DataTable and ChartArea render correctly with mock data.

### 8.2 Integration and End-to-End Tests
- **Playwright** or **Cypress:** Automated UI tests that cover the login flow, data fetching, and key interactions (sorting, filtering, map zoom).  

### 8.3 Linters and Formatters
- **ESLint** with recommended React and TypeScript rules.  
- **Prettier** for consistent code formatting.

---

## 9. Conclusion and Overall Frontend Summary

This frontend setup combines Next.js, TypeScript, Tailwind CSS, and shadcn/ui to deliver a secure, performant, and maintainable dashboard. Key highlights:
- Server-side data fetching keeps secrets on the backend.  
- Component-based design accelerates development and encourages reuse.  
- Theming and styling ensure a modern, executive-friendly look.  
- Testing strategy covers everything from unit tests to full end-to-end flows.

Together, these guidelines align with the project’s goals: delivering an interactive, reliable, and easy-to-maintain visualization layer for your Executive Information System. By following these principles and patterns, any developer—regardless of background—can understand, extend, and operate the frontend with confidence.