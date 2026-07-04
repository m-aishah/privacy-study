-- Migration: enforce unique participant IDs
-- Run this in the Supabase SQL editor if you already ran the original
-- sql/schema.sql and don't want to run the whole file again.

-- 1. Check for any existing duplicate participant IDs first (case-insensitive).
--    If this returns rows, resolve/delete the duplicates before step 2, or the
--    unique index creation below will fail.
select upper(participant_id) as participant_id, count(*) as occurrences
from sessions
group by upper(participant_id)
having count(*) > 1;

-- 2. Add the uniqueness constraint (safe to re-run).
create unique index if not exists sessions_participant_id_unique_idx
  on sessions (upper(participant_id));
