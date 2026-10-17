-- ==========================================================================
-- BrightPath CRM: Demo Seed Data
-- Run this in the Supabase SQL Editor AFTER you have signed up at least one user
-- ==========================================================================

DO $$
DECLARE
  staff_id UUID;
  lead1_id UUID;
  lead2_id UUID;
  lead3_id UUID;
  lead4_id UUID;
  lead5_id UUID;
BEGIN
  -- Grab the first registered user to act as creator/assignee
  SELECT id INTO staff_id FROM public.profiles LIMIT 1;

  IF staff_id IS NULL THEN
    RAISE NOTICE 'No profile found in public.profiles. Please sign up or create at least one user in Supabase Auth before running this seed script.';
    RETURN;
  END IF;

  RAISE NOTICE 'Seeding demo leads using staff profile ID: %', staff_id;

  -- 1. Lead: Aarav Sharma (New Enquiry)
  INSERT INTO public.leads (
    full_name, email, phone, course_interest, source, status, assigned_to, created_by, notes
  ) VALUES (
    'Aarav Sharma',
    'aarav.sharma@example.com',
    '+91 98765 43210',
    'Full Stack Web Development',
    'Website',
    'New',
    staff_id,
    staff_id,
    'Enquired through website contact form regarding weekend batches.'
  ) RETURNING id INTO lead1_id;

  -- 2. Lead: Priya Patel (Contacted - Call Scheduled)
  INSERT INTO public.leads (
    full_name, email, phone, course_interest, source, status, assigned_to, created_by, notes
  ) VALUES (
    'Priya Patel',
    'priya.patel@example.com',
    '+91 98111 22334',
    'Data Science & AI Certification',
    'Phone Call',
    'Contacted',
    staff_id,
    staff_id,
    'Spoke on phone for 10 minutes. Requested syllabus brochure via email.'
  ) RETURNING id INTO lead2_id;

  -- 3. Lead: Rohan Verma (Qualified - Campus Visit Scheduled)
  INSERT INTO public.leads (
    full_name, email, phone, course_interest, source, status, assigned_to, created_by, notes
  ) VALUES (
    'Rohan Verma',
    'rohan.verma@example.com',
    '+91 99222 33445',
    'Cloud Architecture & DevOps',
    'Walk-in',
    'Qualified',
    staff_id,
    staff_id,
    'Visited campus with parents. Very keen on the morning batch starting next Monday.'
  ) RETURNING id INTO lead3_id;

  -- 4. Lead: Ananya Iyer (Converted Student)
  INSERT INTO public.leads (
    full_name, email, phone, course_interest, source, status, assigned_to, created_by, notes
  ) VALUES (
    'Ananya Iyer',
    'ananya.iyer@example.com',
    '+91 97333 44556',
    'UI/UX Design Masterclass',
    'Referral',
    'Converted',
    staff_id,
    staff_id,
    'Admissions confirmed. Batch allocation completed.'
  ) RETURNING id INTO lead4_id;

  -- 5. Lead: Vikram Singh (Lost Enquiry)
  INSERT INTO public.leads (
    full_name, email, phone, course_interest, source, status, loss_reason, assigned_to, created_by, notes
  ) VALUES (
    'Vikram Singh',
    'vikram.singh@example.com',
    '+91 96444 55667',
    'Cybersecurity Specialist',
    'Social Media',
    'Lost',
    'Joined competitor institute',
    staff_id,
    staff_id,
    'Decided to join another institute closer to his residence.'
  ) RETURNING id INTO lead5_id;

  -- 6. Follow-ups
  -- Overdue Follow-up for Aarav Sharma (Due yesterday)
  INSERT INTO public.follow_ups (
    lead_id, assigned_to, due_at, note, status, created_by
  ) VALUES (
    lead1_id,
    staff_id,
    timezone('utc'::text, now() - INTERVAL '1 day'),
    'First touch call: Call student to explain batch curriculum and fee plans.',
    'pending',
    staff_id
  );

  -- Upcoming Follow-up for Priya Patel (Due tomorrow)
  INSERT INTO public.follow_ups (
    lead_id, assigned_to, due_at, note, status, created_by
  ) VALUES (
    lead2_id,
    staff_id,
    timezone('utc'::text, now() + INTERVAL '1 day'),
    'Follow-up on syllabus brochure sent via email.',
    'pending',
    staff_id
  );

  -- Completed Follow-up for Rohan Verma
  INSERT INTO public.follow_ups (
    lead_id, assigned_to, due_at, note, status, completed_at, created_by
  ) VALUES (
    lead3_id,
    staff_id,
    timezone('utc'::text, now() - INTERVAL '2 days'),
    'Campus consultation & counseling session.',
    'completed',
    timezone('utc'::text, now() - INTERVAL '2 days'),
    staff_id
  );

  -- 7. Activities
  INSERT INTO public.activities (lead_id, actor_id, activity_type, description)
  VALUES
    (lead1_id, staff_id, 'lead_created', 'Lead created via Website enquiry form.'),
    (lead2_id, staff_id, 'lead_created', 'Lead created via direct Phone Call.'),
    (lead2_id, staff_id, 'status_changed', 'Status changed from New to Contacted.'),
    (lead3_id, staff_id, 'lead_created', 'Lead created after Walk-in reception inquiry.'),
    (lead3_id, staff_id, 'status_changed', 'Status changed from Contacted to Qualified.'),
    (lead4_id, staff_id, 'lead_created', 'Lead created via Alumni Referral.'),
    (lead4_id, staff_id, 'status_changed', 'Status changed to Converted: Admission confirmed.'),
    (lead5_id, staff_id, 'status_changed', 'Status changed to Lost. Reason: Joined competitor institute.');

  RAISE NOTICE 'Seed completed successfully! Added 5 demo leads, 3 follow-ups, and 8 activity records.';
END $$;
