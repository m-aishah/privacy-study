-- Migration: add the open_ended_responses table (Screen 6)
-- Run this in the Supabase SQL editor if you already ran sql/schema.sql
-- and don't want to run the whole file again.

create table if not exists open_ended_responses (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions (id) on delete cascade,
  question_number integer not null check (question_number between 1 and 5),
  response text,
  created_at timestamptz not null default now()
);

create index if not exists open_ended_responses_session_id_idx on open_ended_responses (session_id);

alter table open_ended_responses enable row level security;

drop policy if exists "anon insert open_ended_responses" on open_ended_responses;
create policy "anon insert open_ended_responses" on open_ended_responses for insert to anon with check (true);
drop policy if exists "anon select open_ended_responses" on open_ended_responses;
create policy "anon select open_ended_responses" on open_ended_responses for select to anon using (true);
