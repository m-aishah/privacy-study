-- PrivacyStudy Supabase schema
-- Run this in the Supabase SQL editor (Project -> SQL Editor -> New query)

create extension if not exists "pgcrypto";

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  participant_id text not null,
  mode text not null check (mode in ('adult', 'children')),
  created_at timestamptz not null default now()
);

create table if not exists slideshow_responses (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions (id) on delete cascade,
  pair_number integer not null check (pair_number between 1 and 15),
  answer text not null check (answer in ('same', 'not_same', 'not_sure')),
  confidence integer not null check (confidence between 1 and 5),
  created_at timestamptz not null default now()
);

create table if not exists see_yourself_responses (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions (id) on delete cascade,
  answer text not null check (answer in ('yes', 'no', 'not_sure')),
  confidence integer not null check (confidence between 1 and 5),
  created_at timestamptz not null default now()
);

create index if not exists slideshow_responses_session_id_idx on slideshow_responses (session_id);
create index if not exists see_yourself_responses_session_id_idx on see_yourself_responses (session_id);

-- Row Level Security: the app writes/reads using the anon key.
-- These policies allow the anon key to insert and read all rows.
-- The /admin dashboard also reads through the anon key with a
-- separate application-level password gate (ADMIN_PASSWORD).
alter table sessions enable row level security;
alter table slideshow_responses enable row level security;
alter table see_yourself_responses enable row level security;

drop policy if exists "anon insert sessions" on sessions;
create policy "anon insert sessions" on sessions for insert to anon with check (true);
drop policy if exists "anon select sessions" on sessions;
create policy "anon select sessions" on sessions for select to anon using (true);

drop policy if exists "anon insert slideshow_responses" on slideshow_responses;
create policy "anon insert slideshow_responses" on slideshow_responses for insert to anon with check (true);
drop policy if exists "anon select slideshow_responses" on slideshow_responses;
create policy "anon select slideshow_responses" on slideshow_responses for select to anon using (true);

drop policy if exists "anon insert see_yourself_responses" on see_yourself_responses;
create policy "anon insert see_yourself_responses" on see_yourself_responses for insert to anon with check (true);
drop policy if exists "anon select see_yourself_responses" on see_yourself_responses;
create policy "anon select see_yourself_responses" on see_yourself_responses for select to anon using (true);
