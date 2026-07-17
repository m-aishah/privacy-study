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
   - `see_yourself_responses` (id, session_id, answer, confidence, created_at) — kept
     for historical data; the see-yourself screen itself is currently disabled
   - `open_ended_responses` (id, session_id, question_number, response, created_at) —
     Screen 6, the open-ended reflection questions after the questionnaire
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
| `NEXT_PUBLIC_SURVEYMONKEY_URL_ADULT` | The adult questionnaire's shareable web link. Despite the variable name (kept for backwards compatibility with existing Vercel config), this works with any survey tool — e.g. a SurveyMonkey "Collect Responses -> Web Link" URL, or a TeamDynamix survey URL like `https://unbc.teamdynamix.com/TDClient/87/Portal/Surveys/TakeSurvey/<id>?responseId=<id>`. The app appends `&participant_id=<id>` to whatever URL you provide and opens it in a new tab (see note below). |
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
    see_yourself_placeholder.jpg      (unused while that screen is disabled)
    demo.{jpg,jpeg,png}                (Screen 6 — original, unmodified demo clip)
    demo_anonymized.{jpg,jpeg,png}     (Screen 6 — same clip with the face anonymized;
                                         same jpg/jpeg/png fallback as the slideshow pairs)
  video/
    adult/action_1_adult.mp4 ... action_15_adult.mp4
    children/                         (not currently used — see note below)
  slideshow/
    pair_1a.jpg, pair_1b.jpg ... pair_16a.jpg, pair_16b.jpg
    (any pair image may be .jpg, .jpeg, or .png — the app tries each
    extension in turn, so it doesn't matter which one you use)
  audio/
    adult/    (see clip list below)
    children/ (same file names, mirrored content)
```

**Video note:** both Adult and Children modes currently play from
`public/video/adult/` (the `children/` folder isn't read yet) until
dedicated children's action videos are recorded — see
`actionVideoSrc()` in `lib/content.ts`.

### Audio clip names (in `public/audio/<mode>/`)

`audioClip(mode, name)` automatically appends `_adult` or `_child` to
whatever base name you pass, so the table below lists the base name —
the actual file is `<base>_adult.mp3` in `public/audio/adult/` and
`<base>_child.mp3` in `public/audio/children/`.

| Base name | Actual filenames | When it plays |
|---|---|---|
| `welcome` | `welcome_adult.mp3` / `welcome_child.mp3` | On load of the welcome page |
| `id_confirmed` | `id_confirmed_adult.mp3` / `id_confirmed_child.mp3` | After the participant ID is submitted |
| `slideshow_intro` | `slideshow_intro_adult.mp3` / `slideshow_intro_child.mp3` | Once, before the first image pair |
| `slideshow_pair_instruction` | `slideshow_pair_instruction_adult.mp3` / `_child.mp3` | Before every pair (all 16) |
| `slideshow_complete` | `slideshow_complete_adult.mp3` / `_child.mp3` | After the 16th pair is answered |
| `game_intro` | `game_intro_adult.mp3` / `_child.mp3` | On load of the game page |
| `action_1` ... `action_15` | `action_1_adult.mp3` ... `action_15_adult.mp3` (and `_child` equivalents) | Before each of the 15 actions |
| `stand_up` | `stand_up_adult.mp3` / `_child.mp3` | On the stand-up break screen (after action 12) |
| `game_complete` | `game_complete_adult.mp3` / `_child.mp3` | After the 15th action |
| ~~`see_yourself_intro`~~ | ~~`see_yourself_intro_adult.mp3` / `_child.mp3`~~ | Not currently played — the see-yourself screen is disabled (code kept, commented out, for reinstatement) |
| ~~`see_yourself_complete`~~ | ~~`see_yourself_complete_adult.mp3` / `_child.mp3`~~ | Same as above |
| `questionnaire_intro` | `questionnaire_intro_adult.mp3` / `_child.mp3` | On load of the questionnaire page |
| `screen6_intro` | `screen6_intro_adult.mp3` / `screen6_intro_child.mp3` | On load of Screen 6 (open-ended questions) |
| `goodbye` | `goodbye_adult.mp3` / `_child.mp3` | On the final goodbye screen |

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
   slideshow (16 image-pair comparisons) -> game (15 actions, with a
   stand-up break after action 12, and a silent trigger to the
   anonymization pipeline via ngrok) -> questionnaire -> Screen 6
   (open-ended reflection questions — 5 for adults, 1 for children) ->
   goodbye. (The see-yourself screen is currently disabled; its code is
   kept, commented out, in case it's reinstated.)

   The questionnaire screen doesn't embed the survey in an iframe — many
   survey tools (including TeamDynamix) block being framed by another
   site. Instead it shows an "Open Questionnaire" button that opens the
   survey in a new browser tab (with `participant_id` appended to the
   URL); the participant completes it there, then returns to the original
   tab and taps "I have completed the questionnaire" to continue.
4. There is no back navigation anywhere past the welcome screen — a
   themed in-app modal intercepts the back button and keyboard reload
   shortcuts (F5, Ctrl/Cmd+R), offering to restart the session instead.
   Clicking the browser's own reload button or closing the tab still
   falls back to the native, unstylable "leave site?" browser dialog,
   since no website's JS can intercept those specific actions.
5. All responses are logged to Supabase; failures are silent and never
   interrupt the session.
6. Sydney or another researcher can review and export session data from
   `/admin` (password-gated via `ADMIN_PASSWORD`).
