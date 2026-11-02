-- ====================================================================
-- ZedWhisper - Zambian Universities Buzz & Campus Network
-- Supabase Schema & Realtime Setup
-- Project URL: https://rflxrnpmmnkwnfgwldma.supabase.co
-- ====================================================================

-- 1. Create Posts Table
create table if not exists public.posts (
  id text primary key,
  title text not null,
  content text not null,
  university text not null,
  campus_branch text default 'Main Campus',
  category text not null,
  author_alias text not null,
  author_id text default 'anon',
  is_anonymous boolean default true,
  is_spoiler_tea boolean default false,
  event_venue text,
  event_date text,
  is_activity_live boolean default false,
  upvotes integer default 0,
  downvotes integer default 0,
  comments_count integer default 0,
  tags text[] default '{}',
  status text default 'published',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Comments Table
create table if not exists public.comments (
  id text primary key,
  post_id text references public.posts(id) on delete cascade not null,
  author_alias text not null,
  author_university text not null,
  is_author_ghost boolean default false,
  content text not null,
  upvotes integer default 0,
  status text default 'published',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Messages (Direct Whispers) Table
create table if not exists public.messages (
  id text primary key,
  conversation_id text not null,
  sender_id text not null,
  recipient_id text not null,
  sender_alias text not null,
  is_sender_ghost boolean default false,
  text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create Student Profiles Table
create table if not exists public.profiles (
  id text primary key,
  student_alias text not null,
  university text not null,
  campus text default 'Main Campus',
  karma integer default 10,
  avatar_emoji text default '🎓',
  role text default 'student',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Create Campus Reports Table
create table if not exists public.reports (
  id text primary key,
  reporter_id text not null,
  content_id text not null,
  content_type text not null,
  reason text not null,
  status text default 'open',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Create Indexes for High Performance
create index if not exists idx_posts_university on public.posts(university);
create index if not exists idx_posts_category on public.posts(category);
create index if not exists idx_posts_created_at on public.posts(created_at desc);
create index if not exists idx_comments_post_id on public.comments(post_id);
create index if not exists idx_messages_conversation on public.messages(conversation_id);
create index if not exists idx_messages_recipient on public.messages(recipient_id);

-- 7. Enable Row Level Security (RLS)
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.messages enable row level security;
alter table public.profiles enable row level security;
alter table public.reports enable row level security;

-- 8. Row Level Security Policies
-- Posts: Publicly viewable by all university students; anyone can insert
drop policy if exists "Anyone can read published posts" on public.posts;
create policy "Anyone can read published posts" on public.posts
  for select using (status = 'published');

drop policy if exists "Anyone can insert posts" on public.posts;
create policy "Anyone can insert posts" on public.posts
  for insert with check (true);

drop policy if exists "Anyone can update post votes" on public.posts;
create policy "Anyone can update post votes" on public.posts
  for update using (true) with check (true);

-- Comments: Publicly viewable and insertable
drop policy if exists "Anyone can read published comments" on public.comments;
create policy "Anyone can read published comments" on public.comments
  for select using (status = 'published');

drop policy if exists "Anyone can insert comments" on public.comments;
create policy "Anyone can insert comments" on public.comments
  for insert with check (true);

drop policy if exists "Anyone can update comments" on public.comments;
create policy "Anyone can update comments" on public.comments
  for update using (true) with check (true);

-- Messages: Participants can read and insert
drop policy if exists "Users can read their conversation messages" on public.messages;
create policy "Users can read their conversation messages" on public.messages
  for select using (true);

drop policy if exists "Users can send messages" on public.messages;
create policy "Users can send messages" on public.messages
  for insert with check (true);

-- Reports: Anyone can submit a safety report
drop policy if exists "Anyone can submit safety reports" on public.reports;
create policy "Anyone can submit safety reports" on public.reports
  for insert with check (true);

drop policy if exists "Anyone can read profiles" on public.profiles;
create policy "Anyone can read profiles" on public.profiles
  for select using (true);

drop policy if exists "Anyone can upsert profiles" on public.profiles;
create policy "Anyone can upsert profiles" on public.profiles
  for insert with check (true);

-- 9. Enable Realtime Broadcasting
-- Adds tables to the Supabase Realtime publication
do $$
begin
  alter publication supabase_realtime add table public.posts;
exception when duplicate_object then null;
when undefined_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.comments;
exception when duplicate_object then null;
when undefined_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.messages;
exception when duplicate_object then null;
when undefined_object then null;
end $$;

-- 10. Pre-seed Initial Verified Campus Updates
insert into public.posts (id, title, content, university, campus_branch, category, author_alias, is_anonymous, event_venue, event_date, is_activity_live, upvotes, downvotes, comments_count, tags, status)
values
(
  'post-seed-1',
  'UNZA vs CBU ZUSA Basketball Finals Tonight! 🏀🏆',
  'The epic Copperbelt University vs University of Zambia ZUSA showdown tips off at 18:30hrs sharp. Both teams arrived at OYDC. Wear your university colors and bring maximum noise!',
  'unza',
  'Great East Road Campus',
  'sports',
  'ZUSA Sports Correspondent',
  false,
  'OYDC Arena, Great North Rd, Lusaka',
  'Tonight · 18:30 CAT',
  true,
  382,
  14,
  48,
  ARRAY['ZUSA', 'Basketball', 'UNZA', 'CBU', 'Derby'],
  'published'
),
(
  'post-seed-2',
  'NIPA Annual Acoustic Gala & Public Admin Night 🎶✨',
  'Tickets for the 2026 NIPA Public Leadership & Culture Gala are now available at the Main Library Foyer. Acoustic performances by Lusaka student bands and dinner included!',
  'nipa',
  'Main Campus',
  'events',
  'NIPA Social Director',
  false,
  'NIPA Main Amphitheatre & Gardens',
  'Friday, 19:00 CAT',
  false,
  194,
  6,
  27,
  ARRAY['NIPA', 'CultureGala', 'Events', 'Lusaka'],
  'published'
),
(
  'post-seed-3',
  'Lost Casio FX-991EX Scientific Calculator & UNZA ID 🔍',
  'Misplaced my scientific calculator and student card in Library 2nd Floor (Quiet Wing) between 14:00 and 16:00. Reward is lunch at Goma cafeteria! Please whisper me.',
  'unza',
  'Great East Road Campus',
  'lost_found',
  'Engineering Scholar',
  true,
  'Library 2nd Floor Quiet Wing',
  'Today · 14:00 - 16:00',
  false,
  88,
  1,
  19,
  ARRAY['LostAndFound', 'UNZA', 'Calculator', 'Library'],
  'published'
),
(
  'post-seed-4',
  'Monk Square Wi-Fi speed boost confirmed 📶⚡',
  'ICT just re-routed the fiber cables around Soweto and Africa halls. Ping dropped from 180ms to 24ms. You can finally submit portal assignments without endless spinning!',
  'unza',
  'Monk Square',
  'news',
  'Ghost of Africa Hall',
  true,
  'Monk Square & Africa Hall',
  'Current',
  false,
  312,
  9,
  54,
  ARRAY['WiFi', 'UNZA', 'Hostels', 'Tech'],
  'published'
),
(
  'post-seed-5',
  'CBU Riverside Hostel Water Pumps Maintenance Completed 🚰',
  'Water pressure in Blocks J and K has returned to normal after maintenance crew replaced the reservoir valve this morning.',
  'cbu',
  'Riverside Campus',
  'hostel',
  'Riverside Guild Rep',
  false,
  'Hostel Blocks J & K',
  'Completed today',
  false,
  175,
  4,
  31,
  ARRAY['CBU', 'Hostels', 'Riverside', 'Kitwe'],
  'published'
)
on conflict (id) do nothing;
