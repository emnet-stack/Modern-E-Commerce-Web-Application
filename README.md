# Modern E-Commerce Web Application

A responsive e-commerce storefront and admin dashboard built as the BE-XPERT Frontend Capstone.

**Live demo:** _add your Vercel URL here_

## Technologies
- Next.js (App Router), TypeScript
- Tailwind CSS, shadcn/ui, lucide-react
- next-themes (light, dark, system)
- EscuelaJS public API

## Features
**Storefront:** home, product listing with search, category, price filter and sorting, product details with related products, categories, cart (localStorage), simulated checkout, registration, login, profile.
**Admin (`/admin`):** overview statistics, product management (list, search, view, create, edit), category management (list, create, edit), read-only user list and details.
**General:** responsive mobile-first UI, theme toggle, loading, error and empty states, accessible forms, dynamic metadata.

## Setup
1. Clone the repository and run `npm install`.
2. Copy `.env.example` to `.env.local`:
   `NEXT_PUBLIC_API_URL=https://api.escuelajs.co/api/v1`
3. Run `npm run dev` and open http://localhost:3000.
4. Production check: `npm run build`.

## Project structure
- `src/app`: routes (`(store)` group for the storefront, `admin` for the dashboard)
- `src/components`: UI grouped by feature (layout, products, categories, cart, auth, admin, shared, ui)
- `src/services`: all API calls (products, categories, auth, users)
- `src/lib`: API client, storage helpers, validation, utilities
- `src/context`: cart and auth state
- `src/types`: TypeScript types

## API integration
All requests go through `src/lib/api.ts` (`apiFetch`), which adds the base URL, JSON headers, the Bearer token when needed, and converts network and HTTP failures into a typed `ApiError`.

Endpoints used: `GET /products`, `/products/{id}`, `/products/{id}/related`, `/categories`, `/categories/slug/{slug}`, `/categories/{id}`, `/categories/{id}/products`, `POST/PUT /products`, `POST/PUT /categories`, `GET /users`, `/users/{id}`, `POST /users`, `POST /users/is-available`, `POST /auth/login`, `GET /auth/profile`, `POST /auth/refresh-token`.

Products are fetched once and searched, filtered and sorted on the client, because the API's price filter needs both bounds and sorting is limited.

## Authentication, authorization and limitations
- Tokens are stored in `localStorage`. This is acceptable for a demo but is not equivalent to a backend-managed httpOnly session.
- `/checkout`, `/checkout/success` and `/profile` use a client-side guard. Client-side protection is not sufficient for production; real protection must be enforced on a server.
- The API provides a `role` field but no trusted role-based authorization. The admin dashboard checks `role === "admin"` from `/auth/profile` as a **development-only access mechanism** and is not secure authorization.
- Checkout is **simulated**: no payment, shipping or order is created. The order summary is kept only in `sessionStorage`.
- The API is shared. There are no delete operations, and edit forms require confirming that the record is a test record.
- The user list depends on API permissions; failures show an "unavailable" state.

## Testing checklist
See the capstone brief (section 34); every item was verified manually before submission.

- The shared EscuelaJS API contains many placeholder and test records created by other students. The storefront filters these out (see src/lib/catalog.ts) while still using only live API data; the admin dashboard shows all records.
