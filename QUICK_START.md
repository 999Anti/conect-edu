# Quick start

## Requirements

- Node.js 18 or later
- npm

## Run locally

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template and fill in any values needed for payments:

   ```bash
   copy .env.example .env.local
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open http://localhost:3000.

The app stores local development data in `.data/conect-edu.json`. That directory is ignored by Git.

## Main routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page |
| `/schools` | Browse schools |
| `/register` and `/login` | Account access |
| `/dashboard` | Parent dashboard |
| `/admin/dashboard` | School administration |
| `/conect/dashboard` | Platform administration |

## Production check

Run `npm run build` before deploying. Start the resulting build with `npm start`.
