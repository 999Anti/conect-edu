# Project structure

```text
src/
  app/          Routes, layouts, and API handlers
  components/   Shared UI and layout components
  constants/    Application constants
  hooks/        Reusable React hooks
  lib/server/   Server-side authentication, HTTP, and data helpers
  services/     Client-side API services
  store/        Client-side state
  types/        TypeScript types
  utils/        Shared utility functions
```

## Important locations

| Path | Purpose |
| --- | --- |
| `src/app/api` | Backend API route handlers |
| `src/app/schools` | School browsing and school-detail pages |
| `src/app/apply` | Application form |
| `src/components/ui` | Reusable inputs, buttons, cards, and dialogs |
| `src/lib/server/database.ts` | Development data-store implementation |
| `.env.example` | Environment variable template |
| `tailwind.config.ts` | Design tokens and Tailwind configuration |

Path aliases are configured in `tsconfig.json`; `@/` maps to `src/`.
