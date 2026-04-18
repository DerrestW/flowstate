-- FlowState Experiences Database Schema

-- Experiences / Services
create table experiences (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  tagline text,
  description text,
  long_description text,
  category text not null, -- 'run', 'water', 'rental', 'logistics', 'event'
  icon text,
  hero_image text,
  gallery_images text[],
  capacity_min int,
  capacity_max int,
  duration text,
  price_starting int,
  price_unit text, -- 'per event', 'per day', 'per person'
  featured boolean default false,
  published boolean default true,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Cities we've worked in
create table cities (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  state text not null,
  hero_image text,
  description text,
  events_count int default 0,
  participants_count int default 0,
  featured boolean default false,
  published boolean default true,
  created_at timestamptz default now()
);

-- Inquiries / Leads from contact form
create table inquiries (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  organization text,
  city text,
  state text,
  experience_interest text[],
  event_date text,
  expected_attendance int,
  message text,
  budget_range text,
  status text default 'new', -- 'new', 'contacted', 'proposal_sent', 'closed_won', 'closed_lost'
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Site stats (editable from admin)
create table site_stats (
  id uuid default gen_random_uuid() primary key,
  key text unique not null,
  value text not null,
  label text not null,
  updated_at timestamptz default now()
);

-- Site settings (hero copy, about, etc)
create table site_settings (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);

-- Testimonials
create table testimonials (
  id uuid default gen_random_uuid() primary key,
  author text not null,
  title text,
  organization text,
  quote text not null,
  city text,
  experience text,
  featured boolean default false,
  published boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Media library
create table media (
  id uuid default gen_random_uuid() primary key,
  filename text not null,
  url text not null,
  alt text,
  tags text[],
  size int,
  created_at timestamptz default now()
);

-- Seed default data
insert into site_stats (key, value, label) values
  ('events', '65+', 'Events Operated'),
  ('participants', '330K+', 'Happy Participants'),
  ('cities', '12+', 'Cities Activated'),
  ('years', '8+', 'Years of Experience');

insert into site_settings (key, value) values
  ('hero_headline', 'We make cities come alive.'),
  ('hero_subline', 'FlowState designs and operates world-class outdoor activations — from 500-foot water slides to movies on the lake.'),
  ('about_headline', 'Built for cities. Trusted by thousands.'),
  ('about_body', 'We are not an event company that does outdoor activations. We are an outdoor activation company. FlowState handles everything from permitting and traffic control to day-of operations — so you just show up and take the credit.');

insert into experiences (slug, title, tagline, description, category, featured, sort_order) values
  ('urban-slide', 'Urban Slide', '500 feet of pure adrenaline', 'The flagship FlowState activation. A 500-foot modular water slide that transforms city streets into summer''s biggest moment.', 'water', true, 1),
  ('mud-run', 'Mud Runs', 'Get dirty. Get loud. Get legendary.', 'Full mud obstacle course productions from course design to operations. Built for thousands of participants.', 'run', true, 2),
  ('color-run', 'Color Runs', 'Where every finish line is a canvas', '5K color powder runs that turn your city into a living rainbow. Family-friendly, photogenic, and unforgettable.', 'run', true, 3),
  ('5k-events', '5K Events', 'Community at full speed', 'Professionally timed and managed 5K events for municipalities, charities, and corporate sponsors.', 'run', false, 4),
  ('donut-boat', 'Donut Boat Rentals', 'The most-photographed rental on the water', 'Giant novelty donut float rentals that drive social media and delight on any waterfront.', 'rental', true, 5),
  ('boat-rentals', 'Boat Rentals', 'Your waterfront, fully activated', 'Managed boat rental programs for marinas, parks, and waterfront venues.', 'rental', false, 6),
  ('sup-rentals', 'SUP Board Rentals', 'Stand up and explore', 'Staff-run, safety-certified stand-up paddleboard rental operations.', 'rental', false, 7),
  ('movies-on-lake', 'Movies on the Lake', 'Cinema, reimagined on water', 'Floating cinema experiences for waterfront venues. Boats, boards, and the perfect sunset backdrop.', 'event', true, 8),
  ('fundraisers', 'Fundraisers', 'Raise more. Give more.', 'Custom fundraising events built around activations. We help your cause break attendance records.', 'event', false, 9),
  ('street-closures', 'City Street Closures', 'We close streets. You open memories.', 'Full traffic control, permitting support, and site planning for city street closure events.', 'logistics', false, 10),
  ('permitting', 'Permitting & Compliance', 'We handle the paperwork. You take the glory.', 'End-to-end permitting, insurance documentation, and municipal compliance for every event type.', 'logistics', false, 11),
  ('site-plans', 'Site Plans & Design', 'Every great event starts on paper', 'Professional site plan design for parks departments, city planners, and venue operators.', 'logistics', false, 12),
  ('traffic-control', 'Traffic Control', 'Safe. Permitted. Professional.', 'Certified traffic control officers and full traffic management planning included in every event package.', 'logistics', false, 13),
  ('procurement', 'Equipment Procurement', 'We know what works.', 'Advisory and procurement services for municipalities and venues building their own activation inventory.', 'logistics', false, 14),
  ('hiring', 'Event Staffing & Hiring', 'Your event. Our people.', 'Trained event staff, safety officers, and operations crew for any size activation.', 'logistics', false, 15);

insert into cities (name, state, featured) values
  ('Houston', 'TX', true),
  ('Hampton', 'VA', true),
  ('Austin', 'TX', true);

insert into testimonials (author, title, organization, quote, featured) values
  ('Marcus Webb', 'Director of Parks & Recreation', 'City of Hampton, VA', 'FlowState handled everything — permits, traffic, staffing. We just showed up and our residents were blown away. We''ve already signed for next year.', true),
  ('Priya Nair', 'Events Manager', 'Houston Parks Department', 'The Urban Slide brought over 8,000 people to our waterfront in a single day. FlowState''s operations team was flawless from setup to teardown.', true),
  ('James Okafor', 'Festival Director', 'ATX Summer Fest', 'We combined the mud run and the color run into a single weekend. Best attendance we''ve ever had. FlowState made it look easy.', false);

-- Media library
create table if not exists media_library (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  url text not null,
  size int default 0,
  type text default 'image/jpeg',
  tag text default 'Other',
  added_at timestamptz default now()
);

-- Seed with the real project images
insert into media_library (name, url, size, type, tag) values
  ('urban-slide.png', '/img-urban-slide.png', 317000, 'image/png', 'Hero'),
  ('urban-slide-splash.png', '/img-urban-slide-splash.png', 259000, 'image/png', 'Experiences'),
  ('mud-run-1.png', '/img-mud-run-1.png', 398000, 'image/png', 'Experiences'),
  ('mud-run-2.png', '/img-mud-run-2.png', 313000, 'image/png', 'Experiences'),
  ('color-run-1.png', '/img-color-run-1.png', 470000, 'image/png', 'Experiences'),
  ('color-run-2.png', '/img-color-run-2.png', 290000, 'image/png', 'Experiences'),
  ('sup-rentals.png', '/img-sup-rentals.png', 218000, 'image/png', 'Rentals'),
  ('donut-boat.png', '/img-donut-boat.png', 343000, 'image/png', 'Rentals'),
  ('donut-boat-hut.png', '/img-donut-boat-hut.png', 393000, 'image/png', 'Rentals'),
  ('light-show.png', '/img-light-show.png', 400000, 'image/png', 'Seasonal'),
  ('convention.png', '/img-convention.png', 380000, 'image/png', 'Experiences'),
  ('trade-show.png', '/img-trade-show.png', 360000, 'image/png', 'Experiences'),
  ('fundraiser.png', '/img-fundraiser.png', 340000, 'image/png', 'Experiences'),
  ('triathlon.png', '/img-triathlon.png', 320000, 'image/png', 'Experiences');

-- Trust logos table
create table if not exists trust_logos (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  abbr text,
  logo_url text default '',
  published boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Insert default trust logos
insert into trust_logos (name, abbr, published, sort_order) values
  ('City of Hampton', 'Hampton, VA', true, 1),
  ('Houston Parks Dept.', 'Houston, TX', true, 2),
  ('City of Austin', 'Austin, TX', true, 3),
  ('ATX Summer Fest', 'Festival', true, 4),
  ('Discovery Green', 'Houston, TX', true, 5),
  ('City of Norfolk', 'Norfolk, VA', true, 6),
  ('Galveston Events', 'Galveston, TX', true, 7),
  ('YMCA Houston', 'Nonprofit', true, 8);

-- Live experiences table  
create table if not exists live_experiences (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  location text,
  address text,
  status text default 'UPCOMING',
  type text default 'EVENT',
  open_since text,
  event_date text,
  hours_day text default 'Monday - Sunday',
  hours_time text default '10:00 AM - 10:00 PM',
  description text,
  ticket_url text,
  hero_image text default '/img-urban-slide.png',
  published boolean default true,
  pricing jsonb default '[]',
  features text[] default '{}',
  created_at timestamptz default now()
);

-- Insert Discovery Green
insert into live_experiences (title, location, address, status, type, open_since, hours_day, hours_time, description, ticket_url, hero_image, published, pricing, features) values
  ('Boats at Discovery Green', 'Houston, Texas', '1500 McKinney St, Houston, TX 77010', 'NOW OPEN', 'PERMANENT', 'February 27, 2026', 'Monday - Sunday', '10:00 AM - 10:00 PM', 
   'Make a splash in the heart of downtown Houston. Discovery Green transforms into the city''s most exciting waterfront playground — featuring motorized bumper boats, four-passenger cruiser boats, and LED-lit clear kayaks.',
   'https://discoverygreen.com', '/img-donut-boat-hut.png', true,
   '[{"name":"Cruiser Boats","price":"$25"},{"name":"Bumper Boats","price":"$12"},{"name":"Kayaks","price":"$12"},{"name":"Boating Bundle","price":"$20"}]',
   ARRAY['Four-passenger cruiser boats','Motorized bumper boats','LED-lit clear kayaks','Open 7 days a week','Beginner-friendly']
  );

-- Update experiences table to add photo field
alter table experiences add column if not exists hero_image text default '';
alter table experiences add column if not exists gallery_images text[] default '{}';

-- Update existing experiences with photos
update experiences set hero_image = '/img-urban-slide.png', description = 'Our flagship activation. A 1,000-foot modular water slide that shuts down streets and opens up cities. The most-photographed day of the summer.' where slug = 'urban-slide';
update experiences set hero_image = '/img-mud-run-2.png' where slug = 'mud-run';
update experiences set hero_image = '/img-color-run-1.png' where slug = 'color-run';
update experiences set hero_image = '/img-color-run-2.png' where slug = '5k-events';
update experiences set hero_image = '/img-donut-boat.png' where slug = 'donut-boat';
update experiences set hero_image = '/img-donut-boat-hut.png' where slug = 'boat-rentals';
update experiences set hero_image = '/img-sup-rentals.png' where slug = 'sup-rentals';
update experiences set hero_image = '/img-light-show.png' where slug = 'movies-on-lake';
update experiences set hero_image = '/img-convention.png' where slug IN ('conventions', 'street-closures');
update experiences set hero_image = '/img-trade-show.png' where slug = 'trade-shows';
update experiences set hero_image = '/img-fundraiser.png' where slug = 'fundraisers';
update experiences set hero_image = '/img-triathlon.png' where slug = 'triathlons';

-- SEO settings per page
create table if not exists seo_pages (
  id uuid default gen_random_uuid() primary key,
  page_slug text unique not null,
  page_name text not null,
  meta_title text,
  meta_description text,
  og_title text,
  og_description text,
  og_image text,
  canonical_url text,
  noindex boolean default false,
  updated_at timestamptz default now()
);

insert into seo_pages (page_slug, page_name, meta_title, meta_description) values
  ('/', 'Homepage', 'FlowState Experiences | Outdoor Events & Activations | Houston, TX', 'FlowState produces world-class outdoor events, seasonal activations, and permanent waterfront experiences. Urban slides, mud runs, crawfish festivals and more.'),
  ('/services', 'Services', 'Event Services | Ticketing, Staffing, Permitting | FlowState', 'Full-service event support including ticketing, staffing, marketing, permitting, traffic control, and site planning.'),
  ('/live', 'Live Experiences', 'Live Experiences | FlowState', 'Currently operating FlowState experiences you can visit, book, or attend right now.'),
  ('/events/urban-slide', 'Urban Slide', 'Urban Slide Events | 1,000-Foot Water Slide | FlowState', 'Book a 1,000-foot modular water slide for your city. Full permitting, staffing, and operations included.'),
  ('/events/mud-runs', 'Mud Runs', 'Mud Run Events | Obstacle Course Productions | FlowState', 'Full mud run and obstacle course event production for cities and venues.'),
  ('/events/color-runs', 'Color Runs', 'Color Run & Graffiti Run Events | FlowState', '5K color powder run events that turn your city into a living rainbow.'),
  ('/events/5k-marathons', '5K / Marathons', '5K & Marathon Events | FlowState', 'Professionally timed 5K and marathon events for municipalities and charities.'),
  ('/events/triathlons', 'Triathlons', 'Triathlon Event Production | FlowState', 'Full triathlon productions including water safety, transition zones, and certified timing.'),
  ('/events/conventions', 'Conventions', 'Convention Production & Management | FlowState', 'Full convention floor management, vendor coordination, registration, and operations.'),
  ('/events/trade-shows', 'Trade Shows', 'Trade Show Operations | FlowState', 'Trade show booth coordination, traffic flow, staffing, and full logistics.'),
  ('/events/fundraisers', 'Fundraisers', 'Fundraising Event Production | FlowState', 'Custom fundraising activations that break attendance and donation records.'),
  ('/seasonal/light-shows', 'Light Shows', 'Light Show Productions | FlowState', 'Spectacular waterfront light show installations for the holiday season.'),
  ('/seasonal/crawfish-festival', 'Crawfish Festivals', 'Crawfish Festival Production | FlowState', 'Complete crawfish festival productions — tents, vendors, music, and operations.'),
  ('/seasonal/movies-on-the-lake', 'Movies on the Lake', 'Movies on the Lake | Floating Cinema | FlowState', 'Floating and lakeside cinema experiences for waterfronts and venues.'),
  ('/permanent/donut-boat-rentals', 'Donut Boat Rentals', 'Donut Boat Rentals | FlowState', 'Giant novelty donut boat rentals — the most-photographed rental on water.'),
  ('/permanent/boat-rentals', 'Boat Rentals', 'Managed Boat Rental Programs | FlowState', 'Turnkey boat rental programs for marinas, parks, and waterfront venues.'),
  ('/permanent/paddle-boards', 'Paddle Boards', 'SUP & Paddle Board Rentals | FlowState', 'Staff-run paddleboard rental operations for any waterfront or lake.');

-- Update all experience images and descriptions (run this to fix existing data)
update experiences set 
  hero_image = '/img-urban-slide.png',
  gallery_images = ARRAY['/img-urban-slide.png', '/img-urban-slide-splash.png'],
  tagline = '1,000 feet of pure summer',
  description = 'Our flagship activation. A 1,000-foot modular water slide that shuts down streets and opens up cities.'
where slug = 'urban-slide';

update experiences set 
  hero_image = '/img-mud-run-2.png',
  gallery_images = ARRAY['/img-mud-run-2.png', '/img-mud-run-1.png'],
  tagline = 'Get dirty. Get loud.'
where slug = 'mud-run';

update experiences set 
  hero_image = '/img-color-run-1.png',
  gallery_images = ARRAY['/img-color-run-1.png', '/img-color-run-2.png']
where slug = 'color-run';

update experiences set 
  hero_image = '/img-color-run-2.png',
  gallery_images = ARRAY['/img-color-run-2.png']
where slug = '5k-events';

update experiences set 
  hero_image = '/img-donut-boat.png',
  gallery_images = ARRAY['/img-donut-boat.png', '/img-donut-boat-hut.png']
where slug = 'donut-boat';

update experiences set 
  hero_image = '/img-donut-boat-hut.png',
  gallery_images = ARRAY['/img-donut-boat-hut.png']
where slug = 'boat-rentals';

update experiences set 
  hero_image = '/img-sup-rentals.png',
  gallery_images = ARRAY['/img-sup-rentals.png']
where slug = 'sup-rentals';

update experiences set 
  hero_image = '/img-light-show.png',
  gallery_images = ARRAY['/img-light-show.png']
where slug = 'movies-on-lake';

update experiences set 
  hero_image = '/img-convention.png',
  gallery_images = ARRAY['/img-convention.png', '/img-trade-show.png']
where slug = 'conventions';

update experiences set 
  hero_image = '/img-trade-show.png',
  gallery_images = ARRAY['/img-trade-show.png', '/img-convention.png']
where slug = 'trade-shows';

update experiences set 
  hero_image = '/img-fundraiser.png',
  gallery_images = ARRAY['/img-fundraiser.png']
where slug = 'fundraisers';

update experiences set 
  hero_image = '/img-triathlon.png',
  gallery_images = ARRAY['/img-triathlon.png']
where slug = 'triathlons';

-- Insert missing experiences if they don't exist
insert into experiences (slug, title, tagline, description, category, hero_image, gallery_images, sort_order, published) 
values
  ('conventions', 'Conventions', 'Where ideas meet scale', 'Full convention production and floor management.', 'event', '/img-convention.png', ARRAY['/img-convention.png', '/img-trade-show.png'], 7, true),
  ('trade-shows', 'Trade Shows', 'Your brand on the floor', 'Trade show operations, booth coordination, and attendee experience.', 'event', '/img-trade-show.png', ARRAY['/img-trade-show.png'], 8, true),
  ('fundraisers', 'Fundraisers', 'Raise more. Give more.', 'Custom fundraising activations that break records.', 'event', '/img-fundraiser.png', ARRAY['/img-fundraiser.png'], 9, true),
  ('triathlons', 'Triathlons', 'Swim, bike, run — fully managed', 'Full triathlon productions including water safety and timing.', 'event', '/img-triathlon.png', ARRAY['/img-triathlon.png'], 10, true),
  ('light-shows', 'Light Shows', 'The night belongs to us', 'Spectacular waterfront light show installations.', 'event', '/img-light-show.png', ARRAY['/img-light-show.png'], 11, true),
  ('crawfish-festival', 'Crawfish Festivals', 'Full production, full pots', 'Complete crawfish festival productions from site planning to last boil.', 'event', '/img-color-run-1.png', ARRAY['/img-color-run-1.png'], 12, true),
  ('movies-on-the-lake', 'Movies on the Lake', 'Cinema reimagined on water', 'Floating and lakeside cinema experiences.', 'event', '/img-sup-rentals.png', ARRAY['/img-sup-rentals.png'], 13, true),
  ('paddle-boards', 'Paddle Board Rentals', 'Stand up and explore', 'Staff-run SUP rental operations for any waterfront.', 'rental', '/img-sup-rentals.png', ARRAY['/img-sup-rentals.png'], 14, true)
on conflict (slug) do update set 
  hero_image = EXCLUDED.hero_image,
  gallery_images = EXCLUDED.gallery_images,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description;

-- Add includes column to experiences
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS includes text[] DEFAULT '{}';

-- Seed includes for Urban Slide
UPDATE experiences SET includes = ARRAY[
  'Full permitting support',
  'Traffic control planning', 
  'Day-of operations crew',
  'Insurance documentation',
  'Site plan design',
  'Equipment transport',
  'Safety staff',
  'Post-event recap'
] WHERE slug = 'urban-slide';

-- Page content table for editable homepage sections
CREATE TABLE IF NOT EXISTS page_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug text NOT NULL DEFAULT 'homepage',
  section text NOT NULL,
  key text NOT NULL,
  value text,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(page_slug, section, key)
);

-- Video URL and type columns for experiences
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS video_url text DEFAULT '';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS type text DEFAULT 'event';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS is_live boolean DEFAULT false;

-- Update existing experiences with video IDs and types
UPDATE experiences SET video_url = 'https://www.youtube.com/watch?v=yxdALAzbnqc', type = 'event' WHERE slug = 'urban-slide';
UPDATE experiences SET video_url = 'https://www.youtube.com/watch?v=b5XFVcKNB7k', type = 'event' WHERE slug = 'mud-run';
UPDATE experiences SET video_url = 'https://www.youtube.com/watch?v=_2Axfcx-UJk', type = 'event' WHERE slug = 'color-run';
UPDATE experiences SET type = 'event' WHERE slug IN ('5k-events','triathlons','conventions','trade-shows','fundraisers');
UPDATE experiences SET type = 'seasonal' WHERE slug IN ('light-shows','crawfish-festival','movies-on-the-lake');
UPDATE experiences SET type = 'permanent' WHERE slug IN ('donut-boat','boat-rentals','paddle-boards');
UPDATE experiences SET video_url = 'https://www.youtube.com/watch?v=DN7p1Ja4h40', type = 'permanent' WHERE slug = 'donut-boat';

-- Slug redirects for deleted/changed activations
CREATE TABLE IF NOT EXISTS slug_redirects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  from_slug text UNIQUE NOT NULL,
  to_url text NOT NULL DEFAULT '/',
  created_at timestamptz DEFAULT now()
);
