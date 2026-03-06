-- ============================================================
-- AB Journal: Supabase Database Migration
-- Run this SQL in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- ============================================================
-- 0a. Shared helper: auto-update updated_at column
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 0b. Create the profiles (users) table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text UNIQUE,
  full_name   text,
  avatar_url  text,
  role        text DEFAULT 'user' CHECK (role IN ('admin', 'editor', 'user')),
  bio         text,
  is_active   boolean DEFAULT true,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- Index on email for fast lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles (email);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Public can view profiles
CREATE POLICY "Public can view profiles"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admin can manage all profiles
CREATE POLICY "Admin can manage all profiles"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Auto-update updated_at on profiles change
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 1a. Articles table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.articles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  slug        text UNIQUE NOT NULL,
  date        date NOT NULL DEFAULT now(),
  category    text,
  tags        text[] DEFAULT '{}',
  excerpt     text,
  hero_image  text,
  author_name text DEFAULT 'Sarah Chen',
  author_role text DEFAULT 'Investigative Journalist',
  reading_time integer DEFAULT 8,
  content     text,
  published   boolean DEFAULT true,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles (slug);
CREATE INDEX IF NOT EXISTS idx_articles_date ON public.articles (date DESC);
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published articles" ON public.articles FOR SELECT USING (published = true);
CREATE POLICY "Auth can view all articles" ON public.articles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth can insert articles" ON public.articles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth can update articles" ON public.articles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can delete articles" ON public.articles FOR DELETE TO authenticated USING (true);

CREATE TRIGGER on_articles_updated BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- 1b. Projects table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  slug        text UNIQUE NOT NULL,
  date        date NOT NULL DEFAULT now(),
  category    text,
  tags        text[] DEFAULT '{}',
  excerpt     text,
  hero_image  text,
  featured    boolean DEFAULT false,
  content     text,
  images      text[] DEFAULT '{}',
  published   boolean DEFAULT true,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects (slug);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published projects" ON public.projects FOR SELECT USING (published = true);
CREATE POLICY "Auth can view all projects" ON public.projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth can insert projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth can update projects" ON public.projects FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can delete projects" ON public.projects FOR DELETE TO authenticated USING (true);

CREATE TRIGGER on_projects_updated BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- 1c. Services table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.services (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  description text,
  icon        text,
  sort_order  integer DEFAULT 0,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Auth can manage services" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- 1d. CV tables
-- ============================================================
CREATE TABLE IF NOT EXISTS public.cv_contact (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone       text DEFAULT '',
  email       text DEFAULT '',
  address     text DEFAULT '',
  updated_at  timestamptz DEFAULT now()
);
ALTER TABLE public.cv_contact ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view cv_contact" ON public.cv_contact FOR SELECT USING (true);
CREATE POLICY "Auth can manage cv_contact" ON public.cv_contact FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.cv_education (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  degree      text NOT NULL,
  institution text NOT NULL,
  period      text NOT NULL,
  description text,
  sort_order  integer DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);
ALTER TABLE public.cv_education ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view cv_education" ON public.cv_education FOR SELECT USING (true);
CREATE POLICY "Auth can manage cv_education" ON public.cv_education FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.cv_experience (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title            text NOT NULL,
  organization     text NOT NULL,
  period           text NOT NULL,
  responsibilities text[] DEFAULT '{}',
  sort_order       integer DEFAULT 0,
  created_at       timestamptz DEFAULT now()
);
ALTER TABLE public.cv_experience ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view cv_experience" ON public.cv_experience FOR SELECT USING (true);
CREATE POLICY "Auth can manage cv_experience" ON public.cv_experience FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.cv_community_work (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  organization text NOT NULL,
  period       text NOT NULL,
  description  text,
  sort_order   integer DEFAULT 0,
  created_at   timestamptz DEFAULT now()
);
ALTER TABLE public.cv_community_work ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view cv_community_work" ON public.cv_community_work FOR SELECT USING (true);
CREATE POLICY "Auth can manage cv_community_work" ON public.cv_community_work FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.cv_skills (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  level      integer DEFAULT 50,
  sort_order integer DEFAULT 0
);
ALTER TABLE public.cv_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view cv_skills" ON public.cv_skills FOR SELECT USING (true);
CREATE POLICY "Auth can manage cv_skills" ON public.cv_skills FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.cv_languages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  proficiency integer DEFAULT 50,
  sort_order  integer DEFAULT 0
);
ALTER TABLE public.cv_languages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view cv_languages" ON public.cv_languages FOR SELECT USING (true);
CREATE POLICY "Auth can manage cv_languages" ON public.cv_languages FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.cv_certifications (
  id     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title  text NOT NULL,
  issuer text NOT NULL,
  year   text NOT NULL,
  sort_order integer DEFAULT 0
);
ALTER TABLE public.cv_certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view cv_certifications" ON public.cv_certifications FOR SELECT USING (true);
CREATE POLICY "Auth can manage cv_certifications" ON public.cv_certifications FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- 2. Create the journals table
-- ============================================================
-- 1. Create the journals table
CREATE TABLE IF NOT EXISTS public.journals (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  slug        text UNIQUE NOT NULL,
  content     text,
  excerpt     text,
  thumbnail   text,
  hero_image  text,
  images      text[] DEFAULT '{}',
  category    text,
  tags        text[] DEFAULT '{}',
  location    text,
  reading_time integer DEFAULT 5,
  published   boolean DEFAULT true,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- 2. Create an index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_journals_slug ON public.journals (slug);

-- 3. Create an index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_journals_created_at ON public.journals (created_at DESC);

-- 4. Enable Row Level Security
ALTER TABLE public.journals ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policy: Public users can SELECT published journals
CREATE POLICY "Public can view published journals"
  ON public.journals
  FOR SELECT
  USING (published = true);

-- 6. RLS Policy: Authenticated users can SELECT all journals (including unpublished)
CREATE POLICY "Authenticated users can view all journals"
  ON public.journals
  FOR SELECT
  TO authenticated
  USING (true);

-- 7. RLS Policy: Authenticated users can INSERT journals
CREATE POLICY "Authenticated users can insert journals"
  ON public.journals
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 8. RLS Policy: Authenticated users can UPDATE journals
CREATE POLICY "Authenticated users can update journals"
  ON public.journals
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 9. RLS Policy: Authenticated users can DELETE journals
CREATE POLICY "Authenticated users can delete journals"
  ON public.journals
  FOR DELETE
  TO authenticated
  USING (true);

-- 10. Auto-update updated_at on row change (uses shared handle_updated_at from section 0a)
CREATE TRIGGER on_journals_updated
  BEFORE UPDATE ON public.journals
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- 11. Seed data (existing journal entries)
-- ============================================================
INSERT INTO public.journals (title, slug, content, excerpt, thumbnail, hero_image, images, category, tags, location, reading_time, published, created_at)
VALUES
(
  'The Role of a Social Worker in Reviving Unused Community Spaces',
  'reviving-unused-community-spaces-kallarawa',
  E'During a recent field visit to the Kallarawa area in the Thiriyai GN Division, I observed several important public spaces lying unused and neglected. These included a multipurpose building constructed by the World Concern NGO, a public meeting hall, and a row of shops. These structures, once built to serve the needs of the community, have now become abandoned due to poor maintenance and lack of management.\n\n## Problems Identified\n\nAs a social worker, this situation raises serious concerns about sustainability, community engagement, and ownership. Infrastructure alone cannot create social change unless it is connected to people and their ongoing participation.\n\n1. **Lack of Maintenance:** The buildings are damaged and not safe for public use.\n2. **Wasted Investment:** Valuable resources used for construction are now unused.\n3. **Low Community Involvement:** People feel disconnected and have no clear role in maintaining the spaces.\n4. **No Structured Use:** The purpose of these spaces has faded without a long-term plan.\n\n## Community-Centered Solutions\n\nTo address this, we need a community-centered and sustainable approach:\n\n### Community Learning Center\n\nThe multipurpose hall can be turned into a space for evening classes, IT training, or life skills workshops for youth and women.\n\n### Women''s Empowerment Hub\n\nA section of the space can be dedicated for sewing classes, handicraft production, or cooperative savings meetings.\n\n### Youth-led Initiatives\n\nShops can be offered to young entrepreneurs to run small businesses or social enterprises.\n\n### Public Dialogue and Events\n\nThe public meeting hall can be used for awareness sessions on health, environment, or disaster preparedness.\n\n### Local Maintenance Groups\n\nForming a community group or volunteer club to take care of the space regularly can build ownership and pride.\n\n## Role of the Social Worker\n\nAs a social worker, my role would be to:\n\n- Facilitate meetings with local leaders and groups\n- Conduct a needs assessment to identify realistic and useful activities\n- Advocate with local authorities or NGOs for minor repairs\n- Build trust and encourage people to take collective responsibility\n- Monitor and evaluate the usage of the space over time\n\nThis case reflects a common issue across many rural areas—good projects fading due to poor follow-up. As a social worker, it is important to act as a bridge between infrastructure and human need. With proper community engagement, these neglected places in Kallarawa can be brought back to life and become strong platforms for development, inclusion, and empowerment.',
  'A case study from Kallarawa, Thiriyai exploring how social workers can transform neglected public spaces into vibrant community hubs through engagement and sustainable practices.',
  '/ab-journal/kallarava/WhatsApp Image 2025-12-30 at 21.53.24.jpeg',
  '/ab-journal/kallarava/WhatsApp Image 2025-12-30 at 21.53.24.jpeg',
  ARRAY[
    '/ab-journal/kallarava/WhatsApp Image 2025-12-30 at 21.53.24.jpeg',
    '/ab-journal/kallarava/WhatsApp Image 2025-12-30 at 21.53.24 (1).jpeg',
    '/ab-journal/kallarava/WhatsApp Image 2025-12-30 at 21.53.25.jpeg',
    '/ab-journal/kallarava/WhatsApp Image 2025-12-30 at 21.53.25 (1).jpeg',
    '/ab-journal/kallarava/WhatsApp Image 2025-12-30 at 21.53.25 (2).jpeg',
    '/ab-journal/kallarava/WhatsApp Image 2025-12-30 at 21.53.26 (1).jpeg',
    '/ab-journal/kallarava/WhatsApp Image 2025-12-30 at 21.53.26.jpeg'
  ],
  'Community Development',
  ARRAY['Social Work', 'Community Engagement', 'Sustainability'],
  'Kallarawa, Thiriyai GN Division, Kucheveli',
  8,
  true,
  '2025-06-20T00:00:00Z'
),
(
  'Changing the System: Reflections from Bandaranaike Airport',
  'changing-system-bandaranaike-airport',
  E'While waiting at Bandaranaike Airport on the arrival side with my friend, an unexpected moment made me reflect on something larger than the situation itself. We were eagerly awaiting the arrival of another friend when I noticed a No Smoking sticker clearly placed in an area where smoking was strictly prohibited. Yet, as I looked around, I saw people casually lighting up cigarettes, completely disregarding the sign.\n\n## The Observation\n\nWhat caught my attention even more was that some of the airline staff themselves were smoking in that area. It left me feeling conflicted—on one hand, there was a system in place, a rule meant to ensure the safety and comfort of all passengers and visitors, yet on the other hand, the very people responsible for enforcing the rules were the ones violating them.\n\n## The Deeper Reflection\n\nThis situation sparked a deeper thought. We constantly hear the need to change the system—whether it''s about improving safety, better services, or enforcing rules. But if those within the system are not abiding by the established rules, how can we expect the system to work as it''s intended?\n\nIt made me realize that we all are part of the system, and change begins with the individual. If people continue to act in contradiction to the values and rules set by society, institutions, or even governments, it creates a sense of inconsistency and chaos.\n\n## How Do We Change the System?\n\nIt''s not enough to point fingers at others, or to simply say, "someone should do something about it." We are part of the system. Every one of us plays a role in making sure things run as they should.\n\nIf we notice issues like this—whether it''s about rules being ignored, social injustices, or failures in a larger structure—we need to take responsibility. We can start by setting an example ourselves.\n\n## Taking Action\n\nWhen we act with integrity and push for others to do the same, we contribute to a larger wave of change. Challenging the norm doesn''t always mean waiting for someone else to take action—it''s about speaking up, encouraging accountability, and creating small but meaningful shifts in behavior.\n\nIn the case of this airport, perhaps it starts with the staff being more aware of the impact of their actions. Maybe there could be more visible reminders or consequences for violating these rules. It''s not about punishment but rather fostering a culture where respect for rules is the standard, not the exception.\n\n## The Realization\n\nAs I stood there, I realized that to change the system, we must begin with ourselves as individuals who respect the rules, promote accountability, and hold ourselves and others to higher standards. Only then can we hope to see a more positive shift in the systems around us.\n\nThe experience at Bandaranaike Airport on February 6 made me think about how often we expect change but rarely take responsibility for creating that change ourselves. Change starts from within. We are the system.',
  'A personal reflection on how individual actions shape systems, observed through a simple moment at Bandaranaike International Airport.',
  '/ab-journal/bandarnayaka/WhatsApp Image 2025-12-30 at 21.54.54.jpeg',
  '/ab-journal/bandarnayaka/WhatsApp Image 2025-12-30 at 21.54.54.jpeg',
  ARRAY[
    '/ab-journal/bandarnayaka/WhatsApp Image 2025-12-30 at 21.54.54.jpeg',
    '/ab-journal/bandarnayaka/WhatsApp Image 2025-12-30 at 21.54.54 (1).jpeg',
    '/ab-journal/bandarnayaka/WhatsApp Image 2025-12-30 at 21.54.55.jpeg'
  ],
  'Social Reflection',
  ARRAY['Accountability', 'System Change', 'Responsibility'],
  'Bandaranaike International Airport',
  6,
  true,
  '2025-02-06T00:00:00Z'
),
(
  'Green Social Work: Promoting Environmental Conservation in Sri Lanka',
  'green-social-work-environmental-conservation',
  E'As a green social worker, my role is to promote environmental conservation and sustainability within the community in Sri Lanka. This journal aims to elaborate on how green social work can address these issues and create positive change.\n\n## The Context\n\nSri Lanka is a country known for its natural beauty and rich biodiversity. However, rapid urbanization, industrialization, and population growth have put immense pressure on its natural resources. Deforestation, pollution, and climate change are some of the key environmental challenges facing the country.\n\n## What is Green Social Work?\n\nGreen social work is a holistic approach that integrates environmental concerns into social work practice. As a green social worker, my focus is on empowering communities to take action for environmental conservation and sustainability. This involves raising awareness, building partnerships, and advocating for policy change.\n\n## Key Roles of a Green Social Worker\n\n### Raising Awareness\n\nOne of the key roles of a green social worker is to raise awareness about environmental issues within the community. This can be done through workshops, seminars, and community events. By educating people about the importance of conservation, we can inspire them to take action in their daily lives.\n\n### Building Partnerships\n\nGreen social work also involves building partnerships with other organizations and stakeholders working towards environmental conservation. By collaborating with government agencies, NGOs, and community groups, we can leverage resources and expertise to create more significant impact.\n\n### Advocating for Policy Change\n\nAnother essential aspect of green social work is advocating for policy change at the local, national, and international levels. This involves lobbying for environmentally friendly policies and regulations that promote sustainability and protect natural resources.\n\n## The Plastic Pollution Challenge\n\nOne of the most pressing environmental issues in Sri Lanka is plastic pollution. As a green social worker, I have been involved in a campaign to raise awareness about the impact of plastic waste on the environment. Through community clean-up drives and educational workshops, we have been able to mobilize local communities to reduce their use of single-use plastics.\n\n## Challenges and Opportunities\n\nWhile promoting environmental conservation and sustainability, green social workers face several challenges. These include limited resources, lack of awareness, and resistance to change. However, there are also many opportunities, such as growing public interest in environmental issues and the increasing availability of sustainable alternatives.\n\n## Conclusion\n\nGreen social work plays a crucial role in promoting environmental conservation and sustainability in Sri Lanka. By raising awareness, building partnerships, and advocating for policy change, green social workers can create positive change and contribute to a more sustainable future for all.',
  'Exploring the role of green social work in addressing environmental challenges and promoting sustainability in Sri Lanka.',
  '/ab-journal/promoting/WhatsApp Image 2025-12-30 at 21.55.52.jpeg',
  '/ab-journal/promoting/WhatsApp Image 2025-12-30 at 21.55.52.jpeg',
  ARRAY['/ab-journal/promoting/WhatsApp Image 2025-12-30 at 21.55.52.jpeg'],
  'Environmental',
  ARRAY['Green Social Work', 'Sustainability', 'Conservation'],
  'Sri Lanka',
  7,
  true,
  '2024-05-15T00:00:00Z'
),
(
  'Improving Accessibility at Railway Stations',
  'improving-accessibility-railway-stations',
  E'Negombo railway station, like many public spaces in Sri Lanka, faces challenges in providing adequate accessibility for persons with disabilities. During a recent visit, I witnessed a blind individual struggling to navigate between platforms due to the absence of essential features such as "Sidewalk Bumps" and handrails on staircases. This experience highlights the urgent need for Sri Lankan Railways to improve accessibility infrastructure to ensure equal access for all passengers.\n\n## Current Challenges\n\n### Lack of Tactile Paving\n\nOne of the key challenges faced by individuals with disabilities at Negombo railway station is the lack of "Sidewalk Bumps" or tactile paving. These bumps serve as a guide for visually impaired individuals, indicating safe pathways and potential hazards. Without these, navigating through the station becomes daunting, especially when crossing from one platform to another.\n\n### Absence of Central Handrails\n\nAnother major issue is the absence of handrails in the middle of staircases. While some staircases have handrails on either side, a central handrail would provide additional support and stability, making it easier for individuals with disabilities, including the blind, to ascend and descend safely.\n\n## Proposed Solutions\n\nTo address these challenges and improve accessibility at Railway stations, Sri Lankan Railways can consider the following suggestions:\n\n### 1. Installation of Sidewalk Bumps\n\nImplementing tactile paving or "Sidewalk Bumps" along pathways leading to and within the station can significantly enhance navigation for visually impaired passengers. These tactile indicators should be placed strategically to guide individuals towards staircases, ticket counters, and other key areas.\n\n### 2. Addition of Handrails\n\nInstalling handrails in the middle of staircases, in addition to the existing ones on the sides, will provide extra support and stability for passengers with disabilities. These handrails should be designed to withstand heavy use and be easily reachable for individuals of varying heights.\n\n### 3. Improvement of Signage\n\nClear and accessible signage with Braille and large print options should be installed throughout the station to help individuals with visual impairments navigate independently. Signage should indicate directions to platforms, ticket counters, restrooms, and other facilities.\n\n### 4. Training for Staff\n\nRailway staff should receive training on assisting passengers with disabilities, including how to guide visually impaired individuals safely through the station. This training should also include awareness about the importance of maintaining accessibility features.\n\n### 5. Regular Maintenance\n\nEnsuring that all accessibility features are regularly inspected and maintained is crucial for their effectiveness. Any damages or obstructions should be promptly addressed to prevent accidents and ensure a smooth travel experience for all passengers.\n\n## Conclusion\n\nImproving accessibility at Railway stations is not just a matter of convenience but a necessity for promoting inclusivity and equal rights for all individuals. By implementing the suggested solutions, Sri Lankan Railways can create a more accessible and welcoming environment for passengers with disabilities, enhancing their travel experience and fostering a more inclusive society.',
  'Addressing the urgent need for improved accessibility infrastructure at Sri Lankan railway stations to ensure equal access for all passengers.',
  '/ab-journal/railway/WhatsApp Image 2025-12-30 at 21.56.59.jpeg',
  '/ab-journal/railway/WhatsApp Image 2025-12-30 at 21.56.59.jpeg',
  ARRAY[
    '/ab-journal/railway/WhatsApp Image 2025-12-30 at 21.56.59.jpeg',
    '/ab-journal/railway/WhatsApp Image 2025-12-30 at 21.56.59 (1).jpeg'
  ],
  'Accessibility',
  ARRAY['Disability Rights', 'Infrastructure', 'Inclusion'],
  'Negombo Railway Station',
  6,
  true,
  '2024-05-14T00:00:00Z'
),
(
  'Supporting Mental Health During COVID-19: The Role of Social Workers',
  'mental-health-covid19-social-workers',
  E'The COVID-19 pandemic has not only posed a significant threat to physical health but has also exacerbated mental health challenges globally. In Sri Lanka, social workers have played a crucial role in providing mental health support during these challenging times. This paper explores the impact of the pandemic on mental health in Sri Lanka and the vital role of social workers in addressing these challenges.\n\n## The Impact of COVID-19 on Mental Health\n\nThe pandemic and associated lockdowns have led to increased levels of stress, anxiety, and depression among the population in Sri Lanka. Factors such as fear of infection, economic uncertainty, and social isolation have contributed to these mental health challenges. According to a survey conducted by the Ministry of Health, nearly 45%% of Sri Lankans have experienced mental health issues since the start of the pandemic.\n\n## The Role of Social Workers\n\nSocial workers in Sri Lanka have been at the forefront of providing mental health support during the pandemic. They have played a crucial role in:\n\n- Identifying individuals in need of support\n- Providing counseling services\n- Connecting people with appropriate mental health resources\n- Raising awareness about mental health issues\n- Reducing the stigma associated with seeking help\n\n## Challenges Faced\n\nDespite their crucial role, social workers in Sri Lanka have faced numerous challenges in providing mental health support during the pandemic:\n\n- Limited resources, including a shortage of mental health professionals and infrastructure\n- The stigma surrounding mental health in Sri Lanka has made it difficult to reach those in need\n- Economic constraints affecting both service providers and those seeking help\n\n## Strategies Employed\n\nTo overcome these challenges, social workers in Sri Lanka have employed various strategies:\n\n### Leveraging Technology\n\nThey have leveraged technology to provide remote counseling services, reaching individuals who may not have access to traditional mental health services.\n\n### Collaboration\n\nSocial workers have collaborated with other healthcare professionals and community organizations to expand their reach and provide comprehensive mental health support.\n\n## Impact and Outcomes\n\nThe efforts of social workers in Sri Lanka have had a significant impact on mental health outcomes during the pandemic. By providing timely support and counseling services, social workers have helped individuals cope with the challenges posed by the pandemic. They have also contributed to reducing the stigma associated with mental health, encouraging more people to seek help when needed.\n\n## Moving Forward\n\nSocial workers in Sri Lanka have played a crucial role in supporting mental health during the COVID-19 pandemic. Despite facing numerous challenges, they have employed innovative strategies to provide much-needed support to individuals and communities. Moving forward, it is essential to recognize the importance of their work and provide them with the resources they need to continue their vital efforts in supporting mental health in Sri Lanka.',
  'Exploring the crucial role of social workers in providing mental health support during the COVID-19 pandemic in Sri Lanka.',
  '/ab-journal/corona/WhatsApp Image 2025-12-30 at 21.57.44.jpeg',
  '/ab-journal/corona/WhatsApp Image 2025-12-30 at 21.57.44.jpeg',
  ARRAY['/ab-journal/corona/WhatsApp Image 2025-12-30 at 21.57.44.jpeg'],
  'Mental Health',
  ARRAY['COVID-19', 'Mental Health', 'Social Work'],
  'Sri Lanka',
  7,
  true,
  '2024-05-13T00:00:00Z'
);

-- ============================================================
-- 11b. Seed articles
-- ============================================================
INSERT INTO public.articles (title, slug, date, category, tags, excerpt, hero_image, author_name, author_role, reading_time, content, published) VALUES
('The Hidden Cost of Digital Surveillance', 'hidden-cost-digital-surveillance', '2025-01-15', 'Politics', ARRAY['Privacy','Technology','Government'], 'As governments expand their surveillance capabilities, citizens are left grappling with the erosion of privacy and the implications for democracy.', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=600&fit=crop', 'Sarah Chen', 'Investigative Journalist', 8, E'In an era where digital footprints are collected at every turn, the balance between security and privacy has never been more precarious.\n\n## The Surveillance State\n\nGovernments worldwide have invested billions in surveillance infrastructure. From facial recognition cameras on city streets to metadata collection programs, citizens are being watched in ways that would have seemed dystopian just a decade ago.\n\n## The Privacy Paradox\n\nWhile many citizens express concern about privacy, they continue to use services that collect vast amounts of personal data. This paradox reveals a deeper issue: the lack of meaningful choice in the digital economy.\n\n## Looking Forward\n\nThe path forward requires robust legislation, transparent oversight, and a renewed commitment to digital rights.', true),
('Climate Migration: The New Reality', 'climate-migration-new-reality', '2025-01-10', 'Environment', ARRAY['Climate Change','Migration','Global'], 'Millions are being displaced by climate change, creating a new category of refugees that existing international law struggles to address.', 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&h=600&fit=crop', 'Sarah Chen', 'Investigative Journalist', 12, E'The climate crisis is reshaping human geography. As sea levels rise, droughts intensify, and extreme weather becomes the norm, millions of people are being forced to leave their homes.\n\n## The Numbers\n\nAccording to recent estimates, over 20 million people are displaced annually by climate-related disasters.\n\n## Legal Gaps\n\nCurrent refugee law doesn''t recognize climate displacement.\n\n## The Way Forward\n\nAddressing climate migration requires a multi-faceted approach: reducing emissions, adapting to change, and creating new legal frameworks.', true),
('The Future of Local Journalism', 'future-local-journalism', '2025-01-05', 'Media', ARRAY['Journalism','Local News','Technology'], 'As newsrooms shrink and local coverage disappears, communities are losing their watchdog. Can new models save local journalism?', 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=600&fit=crop', 'Sarah Chen', 'Investigative Journalist', 10, E'Local journalism is in crisis. Over the past two decades, thousands of local newsrooms have closed.\n\n## The Decline\n\nSince 2004, over 2,000 newspapers have closed in the United States alone.\n\n## New Models\n\nInnovative approaches are emerging: nonprofit newsrooms, community-supported journalism, and collaborative reporting networks.\n\n## Building the Future\n\nThe future of local journalism depends on finding sustainable models that serve communities while maintaining editorial independence.', true),
('Healthcare Inequality in Rural America', 'healthcare-inequality-rural-america', '2024-12-28', 'Health', ARRAY['Healthcare','Rural','Inequality'], 'Rural communities face a healthcare crisis as hospitals close and medical professionals become scarce.', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=600&fit=crop', 'Sarah Chen', 'Investigative Journalist', 9, E'Rural America is experiencing a healthcare crisis.\n\n## The Hospital Closure Crisis\n\nOver 180 rural hospitals have closed since 2005.\n\n## The Provider Shortage\n\nRural areas face a severe shortage of healthcare providers.\n\n## Policy Solutions\n\nAddressing rural healthcare inequality requires policy interventions: expanding Medicaid, incentivizing provider placement, and investing in rural health infrastructure.', true),
('The Algorithmic Divide', 'algorithmic-divide', '2024-12-20', 'Technology', ARRAY['AI','Inequality','Society'], 'As algorithms shape our lives, they are also creating new forms of inequality.', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=600&fit=crop', 'Sarah Chen', 'Investigative Journalist', 11, E'Artificial intelligence promises to transform society, but its benefits are not distributed equally.\n\n## The Promise\n\nAI has the potential to solve complex problems.\n\n## The Reality\n\nCurrent AI systems often perpetuate and amplify existing biases.\n\n## Building Equitable AI\n\nCreating equitable AI requires diverse teams, transparent algorithms, and policies that ensure AI serves all members of society.', true),
('Democracy Under Pressure', 'democracy-under-pressure', '2024-12-15', 'Politics', ARRAY['Democracy','Elections','Global'], 'Around the world, democratic institutions are facing unprecedented challenges.', 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=600&fit=crop', 'Sarah Chen', 'Investigative Journalist', 13, E'Democracy is under pressure globally.\n\n## The Erosion of Trust\n\nPublic trust in democratic institutions has declined in many countries.\n\n## The Information Crisis\n\nDisinformation campaigns are undermining shared facts necessary for democratic discourse.\n\n## Rebuilding Democracy\n\nRebuilding democratic institutions requires addressing the root causes of distrust: inequality, corruption, and the failure of institutions to serve all citizens.', true),
('The Gig Economy''s Hidden Costs', 'gig-economy-hidden-costs', '2024-12-10', 'Economy', ARRAY['Labor','Economy','Work'], 'The gig economy promises flexibility, but workers are paying the price.', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=600&fit=crop', 'Sarah Chen', 'Investigative Journalist', 9, E'The gig economy has transformed how millions of people work.\n\n## The Promise vs. Reality\n\nGig work promises freedom and flexibility, but the reality is often precarious.\n\n## A Path Forward\n\nCreating a fair gig economy requires rethinking labor law and ensuring workers have access to benefits regardless of employment status.', true),
('Renewable Energy''s Promise and Peril', 'renewable-energy-promise-peril', '2024-12-05', 'Environment', ARRAY['Energy','Climate','Technology'], 'The transition to renewable energy is essential, but it is not without challenges.', 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&h=600&fit=crop', 'Sarah Chen', 'Investigative Journalist', 10, E'The transition to renewable energy is accelerating.\n\n## The Growth\n\nRenewable energy capacity has grown exponentially over the past decade.\n\n## The Path Forward\n\nBuilding a sustainable energy future requires careful planning, investment in infrastructure, and honest assessment of trade-offs.', true),
('Education in the Digital Age', 'education-digital-age', '2024-11-28', 'Education', ARRAY['Education','Technology','Inequality'], 'Technology has transformed education, but the digital divide means not all students benefit equally.', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=600&fit=crop', 'Sarah Chen', 'Investigative Journalist', 8, E'The digital transformation of education has accelerated.\n\n## The Digital Divide\n\nAccess to technology and reliable internet varies dramatically.\n\n## The Future of Learning\n\nThe future of education will likely blend digital and in-person learning.', true),
('The Housing Crisis: A Generation Priced Out', 'housing-crisis-generation-priced-out', '2024-11-20', 'Economy', ARRAY['Housing','Economy','Inequality'], 'Skyrocketing housing costs are pricing an entire generation out of homeownership.', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=600&fit=crop', 'Sarah Chen', 'Investigative Journalist', 11, E'The housing crisis is reshaping cities and communities.\n\n## The Numbers\n\nHousing costs have far outpaced wage growth.\n\n## Building the Future\n\nCreating affordable, accessible housing requires rethinking how we build and regulate housing.', true);

-- ============================================================
-- 11c. Seed projects
-- ============================================================
INSERT INTO public.projects (title, slug, date, category, tags, excerpt, hero_image, featured, content, images, published) VALUES
('Community Development Initiative', 'community-development-initiative', '2024-12-01', 'Community Work', ARRAY['Community Development','Sustainability','Empowerment'], 'A comprehensive community development project focusing on sustainable practices and local empowerment.', '/ab-journal/projects/p1/WhatsApp Image 2025-12-31 at 18.18.59.jpeg', true, E'This comprehensive community development project focuses on sustainable practices and local empowerment.\n\n## Project Overview\n\nThe Community Development Initiative addresses multiple aspects of community well-being.\n\n## Key Activities\n\n- Community needs assessment and participatory planning\n- Skills training and capacity building workshops\n- Sustainable livelihood development programs\n- Community infrastructure improvements\n- Environmental conservation activities\n\n## Impact\n\nThe initiative has successfully engaged multiple communities, creating sustainable development models that can be replicated in other areas.', ARRAY['/ab-journal/projects/p1/WhatsApp Image 2025-12-31 at 18.18.59 (1).jpeg','/ab-journal/projects/p1/WhatsApp Image 2025-12-31 at 18.18.59.jpeg','/ab-journal/projects/p1/WhatsApp Image 2025-12-31 at 18.19.00.jpeg','/ab-journal/projects/p1/WhatsApp Image 2025-12-31 at 18.19.01 (1).jpeg','/ab-journal/projects/p1/WhatsApp Image 2025-12-31 at 18.19.01.jpeg'], true),
('Social Welfare Program', 'social-welfare-program', '2024-11-15', 'Social Work', ARRAY['Social Welfare','Community Support','Advocacy'], 'An initiative aimed at improving social welfare and community support systems.', '/ab-journal/projects/p2/WhatsApp Image 2025-12-31 at 18.22.15.jpeg', true, E'The Social Welfare Program is a comprehensive initiative designed to improve social welfare and community support systems.\n\n## Services Provided\n\n- Direct assistance to individuals and families in crisis\n- Case management and referral services\n- Community resource development\n- Advocacy for policy changes\n- Training for community volunteers\n\n## Outcomes\n\nThe program has successfully supported hundreds of individuals and families.', ARRAY['/ab-journal/projects/p2/WhatsApp Image 2025-12-31 at 18.22.15 (1).jpeg','/ab-journal/projects/p2/WhatsApp Image 2025-12-31 at 18.22.15 (2).jpeg','/ab-journal/projects/p2/WhatsApp Image 2025-12-31 at 18.22.15.jpeg','/ab-journal/projects/p2/WhatsApp Image 2025-12-31 at 18.22.16 (1).jpeg','/ab-journal/projects/p2/WhatsApp Image 2025-12-31 at 18.22.16.jpeg'], true),
('Environmental Conservation Project', 'environmental-conservation-project', '2024-10-20', 'Environmental', ARRAY['Conservation','Sustainability','Environment'], 'A project focused on environmental conservation and sustainable development practices.', '/ab-journal/projects/p3/WhatsApp Image 2025-12-31 at 18.22.42.jpeg', true, E'The Environmental Conservation Project focuses on environmental conservation and sustainable development practices.\n\n## Key Initiatives\n\n- Reforestation and tree planting programs\n- Waste management and recycling initiatives\n- Water conservation and protection\n- Biodiversity protection programs\n- Environmental education and awareness\n\n## Results\n\nThe project has successfully protected significant areas of natural habitat.', ARRAY['/ab-journal/projects/p3/WhatsApp Image 2025-12-31 at 18.22.42 (1).jpeg','/ab-journal/projects/p3/WhatsApp Image 2025-12-31 at 18.22.42 (2).jpeg','/ab-journal/projects/p3/WhatsApp Image 2025-12-31 at 18.22.42.jpeg','/ab-journal/projects/p3/WhatsApp Image 2025-12-31 at 18.22.43.jpeg'], true),
('Community Engagement Initiative', 'community-engagement-initiative', '2024-09-10', 'Community Work', ARRAY['Community Engagement','Participation','Development'], 'An initiative promoting active community engagement and participatory development.', '/ab-journal/projects/p4/WhatsApp Image 2025-12-31 at 18.23.17.jpeg', false, E'The Community Engagement Initiative promotes active community engagement and participatory development.\n\n## Activities\n\n- Community meetings and forums\n- Participatory planning workshops\n- Community-led project implementation\n- Capacity building for community leaders\n- Documentation and knowledge sharing\n\n## Impact\n\nThe initiative has successfully increased community participation in development processes.', ARRAY['/ab-journal/projects/p4/WhatsApp Image 2025-12-31 at 18.23.17.jpeg','/ab-journal/projects/p4/WhatsApp Image 2025-12-31 at 18.23.18 (1).jpeg','/ab-journal/projects/p4/WhatsApp Image 2025-12-31 at 18.23.18.jpeg','/ab-journal/projects/p4/WhatsApp Image 2025-12-31 at 18.23.19.jpeg','/ab-journal/projects/p4/WhatsApp Image 2025-12-31 at 18.23.20.jpeg'], true),
('AB Journal', 'ab-journal', '2025-08-01', 'Journal', ARRAY['Journal','Community','Editorial'], 'A community-driven journal highlighting human rights reporting, investigative pieces, and voices from marginalized communities.', '/ab-journal/abjournal.png', true, E'AB Journal is a community-driven publication founded to surface human rights stories, investigations, and first-person accounts from affected communities.\n\n## Mission\n\nTo provide a platform for marginalized voices, document human rights issues, and support investigative reporting.\n\n## Impact\n\nSince launch, the journal has published feature reports that have informed civil society actors and supported local advocacy.', ARRAY['/ab-journal/abjournal.png','/ab-journal/cv1.png','/ab-journal/cv2.png'], true);

-- ============================================================
-- 11d. Seed services
-- ============================================================
INSERT INTO public.services (title, description, icon, sort_order) VALUES
('Investigative Reporting', 'In-depth investigations into complex issues, combining data analysis, document research, and on-the-ground reporting.', 'search', 1),
('Narrative Journalism', 'Long-form storytelling that brings complex issues to life through compelling narratives and human stories.', 'book', 2),
('Data Journalism', 'Data-driven reporting that uses computational methods to uncover patterns and tell stories hidden in numbers.', 'chart', 3),
('Multimedia Storytelling', 'Combining text, photography, video, and interactive elements to create immersive journalistic experiences.', 'camera', 4);

-- ============================================================
-- 11e. Seed CV data
-- ============================================================
INSERT INTO public.cv_contact (phone, email, address) VALUES ('', 'contact@abjournal.org', 'Eastern Province, Sri Lanka');

INSERT INTO public.cv_languages (name, proficiency, sort_order) VALUES
('Tamil', 100, 1), ('English', 85, 2), ('Sinhala', 75, 3);

INSERT INTO public.cv_education (degree, institution, period, description, sort_order) VALUES
('Bachelor of Social Work', 'National Institute Of Social Development', '2021 - 2025', 'Comprehensive study of social work principles, community development, and social justice.', 1),
('AAT Intermediate', 'AAT Sri Lanka', '2018 - 2020', 'Accounting and finance fundamentals.', 2),
('ICT Technician (NVQ - 4)', 'NVTI - Vantharumoolai', '2020 - 2021', 'Technical skills in information and communication technology.', 3),
('Secondary School', 'BT/BC/ Oddamavadi Central College', '2017 - 2020', 'Completed secondary education with focus on social sciences.', 4);

INSERT INTO public.cv_experience (title, organization, period, responsibilities, sort_order) VALUES
('Project Coordinator', 'Resilience Research, Training & Consulting', 'March 2022 - April 2025', ARRAY['Administrating project works and ensuring timely delivery','Building logic for ad-serving platforms','Managing educational institutions and online classrooms','Coordinating with stakeholders and team members'], 1),
('Social Media Coordinator', 'Resilience Research, Training & Consulting (WE - LED Project)', 'April 2023 - October 2024', ARRAY['Researching audience preferences and trends','Overseeing social media campaigns and content strategy','Developing engaging content for multiple platforms','Analyzing social media metrics and performance'], 2),
('Research Assistant', 'UNDP', 'January 2023 - July 2023', ARRAY['Implementing monitoring systems and data collection','Designing research tools and methodologies','Supporting primary data collection in field settings','Analyzing data and preparing reports'], 3),
('Field Investigation Officer', 'MARGA Research Institute', 'July 2023 - January 2025', ARRAY['Conducting field investigations and inspections','Gathering facts and determining conformance to regulations','Identifying hazards and compliance issues','Preparing detailed investigation reports'], 4);

INSERT INTO public.cv_community_work (title, organization, period, description, sort_order) VALUES
('Founder', 'Little Food Cabinet Moment Sri - Lanka', '2021 - Present', 'Founded an initiative to combat poverty and hunger by providing accessible, non-perishable food items in community hubs.', 1),
('Editorial Director', 'AB Journal', '2024 - Present', 'Leading a publication dedicated to raising awareness about human rights violations worldwide through investigative reporting.', 2),
('Provincial Coordinator', 'Sri Lanka Greens - Eastern Province', '2023 - Present', 'Leading environmental initiatives focused on sustainability and conservation.', 3),
('Member', 'Jana Sabha', '2023 - Present', 'Representing and addressing community needs and concerns through grassroots civic engagement.', 4);

INSERT INTO public.cv_skills (name, level, sort_order) VALUES
('Project Management', 90, 1), ('Social Media Management', 85, 2), ('Research & Data Analysis', 88, 3),
('Community Development', 92, 4), ('Field Investigation', 87, 5), ('Content Creation', 83, 6),
('Communication', 95, 7), ('Leadership', 88, 8);

INSERT INTO public.cv_certifications (title, issuer, year, sort_order) VALUES
('ICT Technician (NVQ - 4)', 'NVTI - Vantharumoolai', '2021', 1),
('AAT Intermediate', 'AAT Sri Lanka', '2020', 2);

-- ============================================================
-- 12. Create Admin User
-- ============================================================
-- NOTE: You can also create this user via Supabase Dashboard > Authentication > Users > Add User
-- Username/Email: amrash@admin.com
-- Password: 123456789
--
-- Run this in Supabase SQL Editor to create the admin user directly:

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'amrash@admin.com',
  crypt('123456789', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '{"provider":"email","providers":["email"]}',
  '{"name":"Admin"}',
  false
);

-- Also add to auth.identities (required for Supabase Auth to work)
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
) SELECT
  gen_random_uuid(),
  id,
  json_build_object('sub', id::text, 'email', email)::jsonb,
  'email',
  id::text,
  now(),
  now(),
  now()
FROM auth.users
WHERE email = 'amrash@admin.com';

-- Ensure the admin user also has a profile row with admin role
INSERT INTO public.profiles (id, email, full_name, role)
SELECT id, email, 'Admin', 'admin'
FROM auth.users
WHERE email = 'amrash@admin.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

