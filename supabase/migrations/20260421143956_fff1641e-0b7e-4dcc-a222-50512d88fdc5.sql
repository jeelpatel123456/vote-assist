
-- Roles enum + table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Election steps
CREATE TABLE public.election_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.election_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view election steps"
  ON public.election_steps FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins manage election steps"
  ON public.election_steps FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- FAQs
CREATE TABLE public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view faqs"
  ON public.faqs FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins manage faqs"
  ON public.faqs FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_steps_updated BEFORE UPDATE ON public.election_steps
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_faqs_updated BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed initial content
INSERT INTO public.election_steps (title, description, "order", icon) VALUES
  ('Registration', 'Eligible citizens register to vote by submitting their personal details to the election authority. Verify your registration well before deadlines.', 1, 'UserPlus'),
  ('Nomination', 'Candidates file nomination papers with required documents and deposits. Their eligibility is then scrutinized by the returning officer.', 2, 'FileSignature'),
  ('Campaign', 'Candidates and parties present their platforms through rallies, debates, and media. A model code of conduct governs fair campaigning.', 3, 'Megaphone'),
  ('Voting', 'On polling day, registered voters cast secret ballots at assigned polling stations using paper ballots or electronic voting machines.', 4, 'Vote'),
  ('Counting', 'After polls close, ballots are counted under observation by candidates'' agents and independent observers to ensure transparency.', 5, 'Calculator'),
  ('Results', 'Winners are officially declared by the election commission. Results are published and certified, completing the democratic cycle.', 6, 'Trophy');

INSERT INTO public.faqs (question, answer) VALUES
  ('Who is eligible to vote?', 'Generally, any citizen aged 18 or older who is registered in their constituency and not legally disqualified is eligible to vote.'),
  ('How do I register to vote?', 'You can register online through your national election commission website, by mail, or in person at designated registration offices.'),
  ('What ID do I need at the polling station?', 'Most jurisdictions require a government-issued photo ID such as a passport, driver''s license, or national voter ID card.'),
  ('Can I vote if I am away from home?', 'Yes, most countries offer postal ballots, proxy voting, or early voting options for citizens away from their registered constituency.'),
  ('How is my vote kept secret?', 'Ballots are designed to be anonymous. Voters mark them in private booths, and counting is done without linking ballots to individual voters.');
