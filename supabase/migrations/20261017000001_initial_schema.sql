-- ==========================================================================
-- BrightPath CRM: Initial Schema & Security Migration
-- Version: 20261017000001
-- Tables: profiles, leads, follow_ups, activities
-- Author: BrightPath Academy Engineering Team
-- ==========================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Staff Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'counsellor' CHECK (role IN ('admin', 'manager', 'counsellor')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.profiles IS 'Staff profiles and role assignments for BrightPath Academy CRM.';

-- 3. Student Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  course_interest TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Qualified', 'Converted', 'Lost')),
  loss_reason TEXT,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.leads IS 'Prospective student enquiries and admissions pipeline records.';

-- 4. Follow-ups Table
CREATE TABLE IF NOT EXISTS public.follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  assigned_to UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  due_at TIMESTAMPTZ NOT NULL,
  note TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  completed_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.follow_ups IS 'Scheduled student follow-up calls, counseling sessions, and visits.';

-- 5. Activities Timeline Table
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.activities IS 'Immutable chronological audit log for lead status changes, notes, and milestones.';

-- 6. Helper Function: get_my_role()
-- Runs as SECURITY DEFINER to bypass RLS recursion when reading profiles
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_role TEXT;
BEGIN
  SELECT role INTO current_role
  FROM public.profiles
  WHERE id = auth.uid();
  
  RETURN COALESCE(current_role, 'counsellor');
END;
$$;

COMMENT ON FUNCTION public.get_my_role() IS 'Returns current authenticated user role with fixed search path.';

-- 7. Automated User Signup Profile Handler
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'counsellor'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Updated At Timestamp Trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_leads_updated_at ON public.leads;
CREATE TRIGGER trg_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 9. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON public.leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_created_by ON public.leads(created_by);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_follow_ups_due_status ON public.follow_ups(due_at, status);
CREATE INDEX IF NOT EXISTS idx_follow_ups_lead_id ON public.follow_ups(lead_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_assigned_to ON public.follow_ups(assigned_to);

CREATE INDEX IF NOT EXISTS idx_activities_lead_id ON public.activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_activities_actor_id ON public.activities(actor_id);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON public.activities(created_at DESC);

-- 10. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- 11. RLS Policies: PROFILES
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
CREATE POLICY "profiles_select_policy"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id OR public.get_my_role() IN ('admin', 'manager')
  );

DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
CREATE POLICY "profiles_update_policy"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );

-- 12. RLS Policies: LEADS
DROP POLICY IF EXISTS "leads_select_policy" ON public.leads;
CREATE POLICY "leads_select_policy"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (
    created_by = auth.uid() OR
    assigned_to = auth.uid() OR
    public.get_my_role() IN ('admin', 'manager')
  );

DROP POLICY IF EXISTS "leads_insert_policy" ON public.leads;
CREATE POLICY "leads_insert_policy"
  ON public.leads
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    created_by = auth.uid()
  );

DROP POLICY IF EXISTS "leads_update_policy" ON public.leads;
CREATE POLICY "leads_update_policy"
  ON public.leads
  FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    assigned_to = auth.uid() OR
    public.get_my_role() IN ('admin', 'manager')
  )
  WITH CHECK (
    created_by = auth.uid() OR
    assigned_to = auth.uid() OR
    public.get_my_role() IN ('admin', 'manager')
  );

DROP POLICY IF EXISTS "leads_delete_policy" ON public.leads;
CREATE POLICY "leads_delete_policy"
  ON public.leads
  FOR DELETE
  TO authenticated
  USING (
    public.get_my_role() IN ('admin', 'manager')
  );

-- 13. RLS Policies: FOLLOW_UPS
DROP POLICY IF EXISTS "follow_ups_select_policy" ON public.follow_ups;
CREATE POLICY "follow_ups_select_policy"
  ON public.follow_ups
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.leads
      WHERE leads.id = follow_ups.lead_id
      AND (
        leads.created_by = auth.uid() OR
        leads.assigned_to = auth.uid() OR
        public.get_my_role() IN ('admin', 'manager')
      )
    )
  );

DROP POLICY IF EXISTS "follow_ups_insert_policy" ON public.follow_ups;
CREATE POLICY "follow_ups_insert_policy"
  ON public.follow_ups
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.leads
      WHERE leads.id = follow_ups.lead_id
      AND (
        leads.created_by = auth.uid() OR
        leads.assigned_to = auth.uid() OR
        public.get_my_role() IN ('admin', 'manager')
      )
    )
  );

DROP POLICY IF EXISTS "follow_ups_update_policy" ON public.follow_ups;
CREATE POLICY "follow_ups_update_policy"
  ON public.follow_ups
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.leads
      WHERE leads.id = follow_ups.lead_id
      AND (
        leads.created_by = auth.uid() OR
        leads.assigned_to = auth.uid() OR
        public.get_my_role() IN ('admin', 'manager')
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.leads
      WHERE leads.id = follow_ups.lead_id
      AND (
        leads.created_by = auth.uid() OR
        leads.assigned_to = auth.uid() OR
        public.get_my_role() IN ('admin', 'manager')
      )
    )
  );

DROP POLICY IF EXISTS "follow_ups_delete_policy" ON public.follow_ups;
CREATE POLICY "follow_ups_delete_policy"
  ON public.follow_ups
  FOR DELETE
  TO authenticated
  USING (
    public.get_my_role() IN ('admin', 'manager')
  );

-- 14. RLS Policies: ACTIVITIES
DROP POLICY IF EXISTS "activities_select_policy" ON public.activities;
CREATE POLICY "activities_select_policy"
  ON public.activities
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.leads
      WHERE leads.id = activities.lead_id
      AND (
        leads.created_by = auth.uid() OR
        leads.assigned_to = auth.uid() OR
        public.get_my_role() IN ('admin', 'manager')
      )
    )
  );

DROP POLICY IF EXISTS "activities_insert_policy" ON public.activities;
CREATE POLICY "activities_insert_policy"
  ON public.activities
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    actor_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.leads
      WHERE leads.id = activities.lead_id
      AND (
        leads.created_by = auth.uid() OR
        leads.assigned_to = auth.uid() OR
        public.get_my_role() IN ('admin', 'manager')
      )
    )
  );
