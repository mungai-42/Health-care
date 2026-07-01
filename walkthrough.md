# Walkthrough - Transition to Live Database Operations

We have successfully transitioned the **Afya Flow** clinical dashboard from mock memory state variables to a **live database storage architecture** powered by **Prisma** and **SQLite** (selected for quick local zero-config validation).

---

## 1. Database Schema Updates & Migrations
- Exchanged PostgreSQL for local SQLite file provider `dev.db` to prevent dependency blocks.
- Appended Patient EHR parameters, `Appointment` schedules, `HomeVisit` coordinates, and clinical `TimelineEvent` records to the database schema.
- Applied migrations using:
  `npx prisma migrate dev --name init_live_data`
- Seeded initial real testing profiles with:
  `npx prisma db seed`
  - Admin: `admin@afyaflow.com` (pw: `admin123`)
  - Doctor: `sarah.jenkins@afyaflow.com` (pw: `doc123`)
  - Patient: `s.jenkins@outlook.com` (pw: `patient123`)

---

## 2. Live REST API Controllers
Implemented routing controllers to persist healthcare actions in the database:
- `patient.controller.ts`: Fetching patients list, logging water targets, modifying meal plans, and checking timeline entries.
- `clinical.controller.ts`: Retrieving appointments calendar, scheduling dispatches, and modifying home care progress states.

---

## 3. Frontend Interceptors & Session Handling
- Mounted Axios client interceptors in `web/src/App.tsx`.
- Automatically checks for active JWT authorization tokens in `localStorage`.
- Rewrote the login modal form to POST login requests to `/auth/login` and query live database models.
- If the backend goes offline, the UI falls back to standard mock arrays.

---

## Verification & Compilation Metrics

- **Backend API**: `npx tsc --noEmit` completed with **0 compilation errors**.
- **React Dashboard**: `npx tsc --noEmit` completed with **0 compilation errors**.
- **Production Asset Build**: `npm run build` succeeded in **4.45s**.
