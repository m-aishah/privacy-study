-- Migration: enforce unique participant IDs
-- Run this in the Supabase SQL editor if you already ran the original
-- sql/schema.sql and don't want to run the whole file again.

-- 1. Check for any existing duplicate participant IDs first (case-insensitive).
select upper(participant_id) as participant_id, count(*) as occurrences
from sessions
group by upper(participant_id)
having count(*) > 1;

-- 2. If step 1 returned rows, you must resolve them before the unique index
--    can be created — Postgres will refuse to build a unique index over
--    data that already violates it.
--
--    The statement below keeps only the most recently created session per
--    participant_id and deletes the older duplicate(s), along with their
--    slideshow_responses / see_yourself_responses rows (cascade delete).
--    Review what it would remove first, then uncomment and run it:
--
-- select a.id, a.participant_id, a.mode, a.created_at
-- from sessions a
-- join sessions b
--   on upper(a.participant_id) = upper(b.participant_id)
--   and a.created_at < b.created_at;
--
-- delete from sessions a
-- using sessions b
-- where upper(a.participant_id) = upper(b.participant_id)
--   and a.created_at < b.created_at;

-- 3. Add the uniqueness constraint (safe to re-run once no duplicates remain).
create unique index if not exists sessions_participant_id_unique_idx
  on sessions (upper(participant_id));
