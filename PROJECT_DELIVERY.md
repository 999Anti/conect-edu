# CONECT EDU project overview

CONECT EDU is a web application for helping families find schools and manage applications.

## Technology

- Next.js 14 and React 18
- TypeScript
- Tailwind CSS
- Zustand for client-side authentication state
- A file-backed local data store for development
- Paystack API endpoints for payments

## What is implemented

The application includes public school pages, registration and sign-in, application workflows, status tracking, payment history, and role-specific dashboards. API route handlers live under `src/app/api` and the frontend service layer is in `src/services`.

## Before deployment

1. Set production environment values, including authentication and Paystack settings.
2. Replace the development file store with a managed database if required.
3. Run `npm run build`.
4. Test registration, application submission, payment verification, and each role's dashboard.

## Known development considerations

Local data is stored in `.data/conect-edu.json`. It is intended for development and should not be committed or used as a production data store.
