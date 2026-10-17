# BrightPath CRM — Master Implementation Plan & Context

## 1. Project Overview & Business Context

**BrightPath Academy** is a modern educational coaching institute that receives prospective student enquiries through walk-ins, phone calls, web forms, messaging platforms, and referrals. 

### Core Problem
Enquiries are currently scattered across spreadsheets and messaging apps, resulting in:
- Missed or neglected leads.
- Confusing or duplicate ownership.
- Forgotten, untracked student follow-ups.
- Zero visibility into conversion rates and team pipeline performance.

### Project Mission & Solution
Build a production-grade, secure, and responsive CRM MVP with real Supabase persistence and continuous Vercel deployment.

### System User Roles
- **Administrator**: Full system visibility, staff access, user profile configuration, and operational oversight. Role changes are protected and impossible via client-side UI tampering alone.
- **Manager**: Team-wide pipeline visibility, overdue follow-up monitoring, and lead assignment/reassignment across counsellors.
- **Counsellor**: Manages assigned or personally created leads, updates statuses, logs interaction notes, and schedules/completes follow-ups.

---

## 2. Technology Stack & Reference Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Browser / React UI                    │
│   (React 19 + TypeScript + Vite + React Router + Lucide)    │
└──────────────┬──────────────────────────────▲───────────────┘
               │                              │
               ▼                              │
┌──────────────────────────────┐              │
│  Typed Service Layer         │              │
│  (auth, leads, followups)    │              │
└──────────────┬───────────────┘              │
               ▼                              │
┌──────────────────────────────┐              │
│  Supabase Client Module      │              │
│  (src/lib/supabaseClient.ts) │              │
└──────────────┬───────────────┘              │
               │ (HTTPS/WSS via Anon Key)     │
               ▼                              │
┌─────────────────────────────────────────────┴───────────────┐
│                    Supabase Backend                         │
│  ┌────────────────────┐          ┌───────────────────────┐  │
│  │   Supabase Auth    │          │  PostgreSQL + RLS     │  │
│  │ (Email/Password)   │          │  (profiles, leads,    │  │
│  │                    │          │   follow_ups,         │  │
│  │                    │          │   activities)         │  │
│  └────────────────────┘          └───────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

- **Frontend**: React 19, TypeScript, Vite.
- **Styling**: Single curated design system in Vanilla CSS with responsive layout tokens and navy/slate aesthetic (`#0F172A`, `#1E293B`).
- **Icons**: `lucide-react`.
- **Client Routing**: `react-router-dom` with authenticated wrappers and role-based route guards.
- **Backend & Database**: Supabase PostgreSQL with Row Level Security (RLS) on all public tables.
- **Authentication**: Supabase Auth (email/password session lifecycle).
- **Deployment & Hosting**: GitHub continuous deployment to Vercel.

---

## 3. Data Model & Database Schema

### 3.1 Tables & Schema Structure

#### `profiles`
- `id` (UUID, PK, references `auth.users(id)` ON DELETE CASCADE)
- `full_name` (text, not null)
- `role` (text, not null, check constraint: `'admin' | 'manager' | 'counsellor'`, default: `'counsellor'`)
- `created_at` (timestamptz, default: `now()`)
- `updated_at` (timestamptz, default: `now()`)

#### `leads`
- `id` (UUID, PK, default: `gen_random_uuid()`)
- `full_name` (text, not null)
- `email` (text, nullable)
- `phone` (text, not null)
- `course_interest` (text, not null)
- `source` (text, not null)
- `status` (text, not null, check constraint: `'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost'`, default: `'New'`)
- `loss_reason` (text, nullable)
- `assigned_to` (UUID, references `profiles(id)` ON DELETE SET NULL, nullable)
- `created_by` (UUID, references `profiles(id)`, not null)
- `notes` (text, nullable)
- `created_at` (timestamptz, default: `now()`)
- `updated_at` (timestamptz, default: `now()`)

#### `follow_ups`
- `id` (UUID, PK, default: `gen_random_uuid()`)
- `lead_id` (UUID, references `leads(id)` ON DELETE CASCADE, not null)
- `assigned_to` (UUID, references `profiles(id)`, not null)
- `due_at` (timestamptz, not null)
- `note` (text, not null)
- `status` (text, not null, check constraint: `'pending' | 'completed' | 'cancelled'`, default: `'pending'`)
- `completed_at` (timestamptz, nullable)
- `created_by` (UUID, references `profiles(id)`, not null)
- `created_at` (timestamptz, default: `now()`)

#### `activities`
- `id` (UUID, PK, default: `gen_random_uuid()`)
- `lead_id` (UUID, references `leads(id)` ON DELETE CASCADE, not null)
- `actor_id` (UUID, references `profiles(id)`, not null)
- `activity_type` (text, not null) — e.g. `'lead_created'`, `'status_changed'`, `'note_added'`, `'followup_created'`, `'followup_completed'`
- `description` (text, not null)
- `metadata` (JSONB, nullable)
- `created_at` (timestamptz, default: `now()`)

---

## 4. Security & Access Control Model

1. **Client Isolation**: Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are placed in frontend bundles. Never expose `service_role` keys or database connection strings.
2. **Row-Level Security (RLS)**:
   - Enabled immediately on all 4 tables (`profiles`, `leads`, `follow_ups`, `activities`).
   - `profiles`: All authenticated users can read their own profile; managers and admins can read all profiles (required for lead assignment dropdowns).
   - Users cannot edit their own `role` column (blocking self-elevation).
   - `leads`:
     - Counsellors: Can SELECT / UPDATE only leads where `assigned_to = auth.uid()` or `created_by = auth.uid()`.
     - Managers & Admins: Can SELECT, INSERT, UPDATE, and DELETE all team leads.
   - `follow_ups` & `activities`: Access inherits from the parent `leads` table via SQL `EXISTS` subqueries.
3. **Security Definer Function**:
   - `get_my_role()` helper with `SECURITY DEFINER` and `SET search_path = public` to prevent recursive RLS policy lookups and path injection.
4. **Admin Bootstrapping**:
   - Initial administrator role assigned via controlled SQL statement in the Supabase Dashboard SQL Editor, not through an unsecured registration endpoint.

---

## 5. Iterative Development Cycle for Each Phase

Each phase must be executed completely through this 6-step loop before moving to the next:
```
1. Develop Feature   ──► Complete logic, UI, and data flow
2. Test Locally      ──► Run unit checks, forms, and TypeScript build
3. Verify Acceptance ──► Check criteria against specification
4. Deploy to Vercel  ──► Push commit to GitHub, build on Vercel
5. Test Live App     ──► Smoke test features on live URL
6. Sign-off & Next   ──► Document results and move to next phase
```

---

## 6. Phased Execution Roadmap

### Phase 0: Repository Hygiene, Git Baseline & Conflict Resolution
- **Goal**: Clean git state and establish project integrity.
- **Tasks**:
  - Resolve unresolved git merge conflict in `README.md`.
  - Create `.env.example` with public environment placeholders.
  - Verify `.gitignore` rules prevent leaking secrets and local environment files.
- **Verification**: `npm run build` and `npm run lint` succeed; working tree clean.

### Phase 1: Project Architecture, TypeScript Configuration & Application Shell
- **Goal**: Scaffold React 19 + TypeScript architecture with cohesive layout shell.
- **Tasks**:
  - Install `react-router-dom`, `lucide-react`, `typescript`, `@types/node`.
  - Configure `tsconfig.json` and convert `.jsx` to `.tsx`.
  - Implement design system in `src/index.css` (navy/slate palette, responsive variables).
  - Build navigation shell: Sidebar (desktop), Topbar (mobile drawer), and route shells for Dashboard, Leads, Follow-ups, Reports, and Settings.
- **Verification**: Zero TypeScript compilation errors (`tsc --noEmit`); navigation works across all routes; deploy and verify on Vercel.

### Phase 2: Supabase Client Integration & Environment Configuration Guard
- **Goal**: Configure client and add fail-safe environment validation.
- **Tasks**:
  - Install `@supabase/supabase-js`.
  - Build singleton client in `src/lib/supabaseClient.ts`.
  - Add `EnvWarningBanner` component that renders clear guidance when keys are missing rather than throwing unhandled runtime exceptions.
  - Define initial `src/types/database.types.ts`.
- **Verification**: Build succeeds; app displays setup banner when keys are missing; deploy and verify on Vercel.

### Phase 3: Database Schema Migration, Constraints, Indexes & RLS Policies
- **Goal**: Deliver repeatable PostgreSQL migration script.
- **Tasks**:
  - Author `supabase/migrations/20261017000001_initial_schema.sql` containing all 4 tables, foreign keys, check constraints, and performance indexes.
  - Implement `public.get_my_role()` `SECURITY DEFINER` function.
  - Enable and write RLS policies for profiles, leads, follow-ups, and activities.
  - Provide demo seed script `supabase/seed.sql`.
- **Verification**: User runs SQL in Supabase SQL Editor; verify tables and policies active.

### Phase 4: Supabase Authentication, Profile Lifecycle & Role-Based Access Control
- **Goal**: Implement multi-user auth and role-based route protection.
- **Tasks**:
  - Implement `AuthContext` with sign-in, sign-out, session recovery, and profile loading.
  - Build `LoginPage` with clear validation, loading states, and error alerts.
  - Implement `ProtectedRoute` and `RoleGuard` components.
  - Display active user profile and role badge in navbar.
- **Verification**: Log in with Admin, Manager, and Counsellor accounts; test invalid credentials and session refresh; deploy and verify on live Vercel URL.

### Phase 5: Lead Management — Form Validation, CRUD, Search & Multi-Filters
- **Goal**: Implement complete lead management with real database persistence.
- **Tasks**:
  - Build `leadsService.ts` for typed Supabase operations.
  - Create lead modal with field-level validation (name, phone, course, source, optional email) and submit-lock during save.
  - Implement lead table with search across name, phone, course, and email.
  - Multi-filtering by Status, Source, and Assignee, plus "Reset Filters" action.
  - Reusable `StatusBadge` component.
- **Verification**: Create lead &rarr; refresh &rarr; search &rarr; edit; confirm data persists in Supabase; deploy and verify on live Vercel URL.

### Phase 6: Lead Lifecycle — Status Workflow, Loss Reasons & Activity Timeline
- **Goal**: Track lead status progression and chronological activity history.
- **Tasks**:
  - Build Lead Detail view (`/leads/:id`).
  - Implement quick status transitions: `New` &rarr; `Contacted` &rarr; `Qualified` &rarr; `Converted` &rarr; `Lost`.
  - Require structured loss reason modal when marking status as `Lost`.
  - Build activity timeline logging: lead creation, status changes, notes, and follow-up completion.
  - Form to record counsellor notes.
- **Verification**: Move lead through statuses; confirm loss reason required; verify timeline reflects real events; deploy and verify on live Vercel URL.

### Phase 7: Follow-up Scheduling Engine & Overdue Tracking
- **Goal**: Timely follow-up reminders with strict date calculations.
- **Tasks**:
  - Build `followupsService.ts` and scheduler modal with due date/time, note, and assignee.
  - Implement overdue logic: `status = 'pending' AND due_at < now()`.
  - Build Follow-ups page with tabs: Overdue (alert style), Today, Upcoming, and Completed.
  - One-click "Mark Complete" action (sets `completed_at` and logs activity).
  - Direct navigation link to parent lead.
- **Verification**: Create overdue item &rarr; check overdue badge &rarr; mark complete &rarr; verify overdue state clears; deploy and verify on live Vercel URL.

### Phase 8: Live Dashboard KPI Metrics & Analytical Reports
- **Goal**: Real-time KPI analytics strictly scoped to user roles.
- **Tasks**:
  - Build `metricsService.ts` querying live database counts.
  - Dashboard KPI cards: Total Leads, New Leads, Converted Leads, Overdue Follow-ups, Conversion Rate (`(Converted / Total) * 100` with divide-by-zero guard).
  - Action widgets: Overdue Follow-ups list and Recent Leads table.
  - Distribution breakdown widgets by Status and Source.
  - Reports page utilizing identical metric formulas.
- **Verification**: Reconcile dashboard metrics with lead and follow-up lists; verify Counsellor sees only assigned leads while Manager/Admin sees team totals; deploy and verify on live Vercel URL.

### Phase 9: UI Accessibility, Responsive Polish & Global Error Boundaries
- **Goal**: Production-quality user experience, mobile responsiveness, and resilience.
- **Tasks**:
  - Audit semantic HTML, visible focus states, form labels, and ARIA dialog attributes.
  - Add `ErrorBoundary` and toast notification system.
  - Verify layouts on mobile (375px), tablet, and desktop viewports.
  - Implement loading skeleton states to eliminate layout shifts.
- **Verification**: Test with keyboard navigation only; test at 375px width; simulate offline/database error; deploy and verify on live Vercel URL.

### Phase 10: Final Production Audit, Verification & Student Handover
- **Goal**: Full acceptance verification, deployment audit, and documentation handover.
- **Tasks**:
  - Complete end-to-end user acceptance test workflow on live Vercel deployment.
  - Update `README.md` with full architecture documentation, setup instructions, SQL migrations, admin bootstrap guide, and production limitations.
  - Generate complete `TESTING_CHECKLIST.md` documenting verified checks.
- **Verification**: Live production sign-off.
