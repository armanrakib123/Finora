# Frontend — Banking System

Angular 21 application for the Banking System. Provides a modern, responsive UI for managing accounts, transfers, deposits, and withdrawals.

## Prerequisites

- Node.js 20+
- npm 10+
- Backend server running on http://localhost:8080

## Setup

```bash
npm install
```

## Development server

```bash
npm start
```

Navigate to `http://localhost:4200/`. The app proxies API requests to the backend.

## Build

```bash
npm run build
```

Output is in `dist/frontend`.

## Running tests

```bash
ng test
```

## Project structure

- `src/app/components/` — UI components (landing, login, register, dashboard, etc.)
- `src/app/services/` — HTTP services (auth, account, transaction)
- `src/app/guards/` — Route guards (auth)
- `src/app/models/` — TypeScript interfaces
