-- Migration: allow pair_number up to 16 (the slideshow activity grew from
-- 15 to 16 pairs). Run this in the Supabase SQL editor if you already ran
-- sql/schema.sql with the old 1-15 constraint.

alter table slideshow_responses
  drop constraint if exists slideshow_responses_pair_number_check;

alter table slideshow_responses
  add constraint slideshow_responses_pair_number_check
  check (pair_number between 1 and 16);
