# Modern E-Commerce Web Application

A responsive e-commerce website with a storefront and admin dashboard, built for the BE-XPERT Frontend Capstone Project.

## Technologies Used

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- next-themes
- EscuelaJS Fake Store API

## Features

### Storefront

- Browse products and categories
- Search, filter, and sort products
- View product details and related products
- Shopping cart
- Simulated checkout
- User registration and login
- User profile

### Admin Dashboard

- Dashboard overview and statistics
- View, search, create, and edit products
- View, create, and edit categories
- View users and their details

### General

- Responsive design for mobile and desktop
- Light and dark themes
- Loading, error, and empty states
- Form validation and accessibility features

## Getting Started

1. Clone the repository.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the project root and add:

   ```env
   NEXT_PUBLIC_API_URL=https://api.escuelajs.co/api/v1
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

To check the production build, run:

```bash
npm run build
```

## Project Structure

- `src/app` — Application pages and routes
- `src/components` — Reusable UI components
- `src/services` — API requests for products, categories, authentication, and users
- `src/lib` — API utilities, validation, storage helpers, and shared functions
- `src/context` — Cart and authentication state
- `src/types` — TypeScript types

## API Integration

The application uses the EscuelaJS Fake Store API to retrieve and manage product, category, and user data.

API requests are handled through `src/lib/api.ts`, which centralizes requests, authentication headers, and error handling.

Products are fetched from the API and filtered, searched, and sorted on the client side.

## Authentication and Limitations

- Authentication tokens are stored in `localStorage`.
- Some protected pages use client-side authentication guards.
- Admin access depends on the role information returned by the API and is intended for this capstone demonstration, not production security.
- Checkout is simulated; no real payment or order is processed.
- API data may include test records created by other users.
- Some administrative operations depend on the API's supported endpoints and permissions.

## Author

**Name:** EMNET

**Project:** BE-XPERT Frontend Capstone

