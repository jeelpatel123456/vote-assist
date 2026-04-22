-- Eligibility submissions table
CREATE TABLE public.eligibility_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  age INTEGER NOT NULL,
  citizen BOOLEAN NOT NULL,
  registered BOOLEAN NOT NULL,
  result TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.eligibility_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit eligibility check"
  ON public.eligibility_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins view eligibility submissions"
  ON public.eligibility_submissions FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage eligibility submissions"
  ON public.eligibility_submissions FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admin-only function to list users (emails come from auth.users)
CREATE OR REPLACE FUNCTION public.admin_list_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  created_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ,
  is_admin BOOLEAN
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT
    u.id,
    u.email::TEXT,
    u.created_at,
    u.last_sign_in_at,
    EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = u.id AND r.role = 'admin') AS is_admin
  FROM auth.users u
  ORDER BY u.created_at DESC;
END;
$$;