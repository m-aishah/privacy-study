# PrivacyStudy

**Privacy-Preserving Video Anonymization for Human-Robot Interaction Research**

Research session app for the UNBC Robotics and Human-Robot Interaction group
(supervised by Dr. Shruti Chandra), used to run in-person evaluations of a
real-time video anonymization pipeline. Built with Next.js 14 (App Router),
Tailwind CSS, and Supabase, deployed on Vercel.

## 1. Supabase setup — SQL to run

1. Create a project at https://supabase.com (or open an existing one).
2. Go to **SQL Editor -> New query**.
3. Paste the contents of [`sql/schema.sql`](./sql/schema.sql) and run it. It creates:
   - `sessions` (id, participant_id, mode, created_at)
   - `slideshow_responses` (id, session_id, pair_number, answer, confidence, created_at)
   - `see_yourself_responses` (id, session_id, answer, confidence, created_at)
   - Row Level Security policies that allow the app's anon key to insert and
     read rows (the `/admin` dashboard also reads through the anon key, gated
     by the separate `ADMIN_PASSWORD` app-level check).
   - A unique index on participant ID (case-insensitive) so the same ID can't
     be used for two sessions.

You can re-run the script safely — it uses `if not exists` / `drop policy if
exists` guards.

If you already ran an older version of `schema.sql` and don't want to re-run
the whole file, apply just the new pieces from
[`sql/migrations/`](./sql/migrations) instead — each migration file is
numbered and safe to run once.

## 2. Environment variables — where to get each one

Copy [`.env.local.example`](./.env.local.example) to `.env.local` for local
development, and add the same keys under **Vercel -> Project -> Settings ->
Environment Variables** for deployment.

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard -> your project -> **Settings -> API** -> "Project URL" |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same page -> "Project API keys" -> `anon` `public` key (not the `service_role` key) |
| `NEXT_PUBLIC_SURVEYMONKEY_URL_ADULT` | In SurveyMonkey, open the adult questionnaire -> **Collect Responses -> Web Link** -> copy the share URL |
| `NEXT_PUBLIC_SURVEYMONKEY_URL_CHILDREN` | Same, but for the children's questionnaire |
| `NEXT_PUBLIC_NGROK_URL` | Start ngrok on the pipeline computer (`ngrok http <port>`) and copy the `https://xxxx.ngrok-free.app` forwarding URL it prints. The app POSTs to `${NEXT_PUBLIC_NGROK_URL}/start` when the game activity begins — this URL changes every time ngrok restarts unless you're on a paid plan with a reserved domain, so update it before each session if needed. |
| `ADMIN_PASSWORD` | Any password you choose — used only to gate `/admin`. Do **not** prefix it with `NEXT_PUBLIC_` since it must stay server-side only. |

## 3. Asset naming

Assets are not committed to the repo — drop them into `public/` using these
exact names and the app will pick them up automatically:

```
public/
  images/
    unbc_logo.svg                     (already present)
    unbc_favicon_small_logo.jpeg      (already present)
    see_yourself_placeholder.jpg
  video/
    adult/action_1_adult.mp4 ... action_15_adult.mp4
    children/action_1_child.mp4 ... action_15_child.mp4
  slideshow/
    pair_1a.jpg, pair_1b.jpg ... pair_15a.jpg, pair_15b.jpg
  audio/
    adult/    (see clip list below)
    children/ (same file names, mirrored content)
```

### Audio clip names (per mode, in `public/audio/<mode>/`)

| File | When it plays |
|---|---|
| `welcome.mp3` | On load of the welcome page |
| `id_confirmed.mp3` | After the participant ID is submitted |
| `slideshow_intro.mp3` | Once, before the first image pair |
| `slideshow_pair_instruction.mp3` | Before every pair (all 15) |
| `slideshow_complete.mp3` | After the 15th pair is answered |
| `game_intro.mp3` | On load of the game page |
| `action_1_cue.mp3` ... `action_15_cue.mp3` | Before each of the 15 actions |
| `stand_up.mp3` | On the stand-up break screen (after action 12) |
| `game_complete.mp3` | After the 15th action |
| `see_yourself_intro.mp3` | On load of the see-yourself page |
| `see_yourself_complete.mp3` | After the recognisability question is answered |
| `questionnaire_intro.mp3` | On load of the questionnaire page |
| `goodbye.mp3` | On the final goodbye screen |

A missing or failed-to-load clip is skipped silently — it will never block
the session.

## 4. Running locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` — this is the coordinator's mode-select page.
`/admin` is the researcher dashboard.

## 5. Deploying to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel and set the environment variables from step 2 above.
3. Deploy. The app is fully static/serverless-compatible with the Next.js
   App Router and requires no additional build configuration.

## 6. How a session runs

1. Sydney (the coordinator) opens `/`, picks Adult or Children mode.
2. She enters the participant ID on the welcome screen, then hands the
   laptop to the participant.
3. The participant is guided, screen by screen, through: welcome ->
   slideshow (15 image-pair comparisons) -> game (15 actions, with a
   stand-up break after action 12, and a silent trigger to the
   anonymization pipeline via ngrok) -> see-yourself question ->
   SurveyMonkey questionnaire -> goodbye.
4. There is no back navigation anywhere past the welcome screen, and
   refreshing prompts a native "leave site?" warning.
5. All responses are logged to Supabase; failures are silent and never
   interrupt the session.
6. Sydney or another researcher can review and export session data from
   `/admin` (password-gated via `ADMIN_PASSWORD`).
