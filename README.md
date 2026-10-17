# BrightPath CRM

A modern, secure student lead management and admissions CRM for **BrightPath Academy**, built with React 19, TypeScript, Vite, and Supabase.

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite, React Router, Lucide Icons, Vanilla CSS
- **Backend / Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth (Email / Password)
- **Deployment**: Vercel

## Local Development Setup

### 1. Prerequisites
- Node.js 18+ (Node 20+ recommended)
- npm or pnpm
- A Supabase project

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-client-anon-key
```

### 4. Running Locally
```bash
npm run dev
```

### 5. Typecheck & Build
```bash
npm run build
```
