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
  pair_number integer not null check (pair_number between 1 and 16),
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

-- The open-ended reflection screen (Screen 6). question_number is 1-5 for
-- the adult version's five questions, and always 1 for the children's
-- single-question version. response is nullable since answering is optional
-- (the adult version also has an explicit Skip action).
create table if not exists open_ended_responses (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions (id) on delete cascade,
  question_number integer not null check (question_number between 1 and 5),
  response text,
  created_at timestamptz not null default now()
);

create index if not exists slideshow_responses_session_id_idx on slideshow_responses (session_id);
create index if not exists see_yourself_responses_session_id_idx on see_yourself_responses (session_id);
create index if not exists open_ended_responses_session_id_idx on open_ended_responses (session_id);

-- Participant IDs (e.g. "A1", "C1") must be unique across all sessions.
-- Indexed on upper(participant_id) so it's enforced case-insensitively
-- regardless of how a row was inserted.
create unique index if not exists sessions_participant_id_unique_idx
  on sessions (upper(participant_id));

-- Row Level Security: the app writes/reads using the anon key.
-- These policies allow the anon key to insert and read all rows.
-- The /admin dashboard also reads through the anon key with a
-- separate application-level password gate (ADMIN_PASSWORD).
alter table sessions enable row level security;
alter table slideshow_responses enable row level security;
alter table see_yourself_responses enable row level security;
alter table open_ended_responses enable row level security;

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

drop policy if exists "anon insert open_ended_responses" on open_ended_responses;
create policy "anon insert open_ended_responses" on open_ended_responses for insert to anon with check (true);
drop policy if exists "anon select open_ended_responses" on open_ended_responses;
create policy "anon select open_ended_responses" on open_ended_responses for select to anon using (true);
