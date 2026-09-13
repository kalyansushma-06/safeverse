# SafeVerse — AR Industrial Safety Training

A scenario-based, AR-powered safety training and certification platform.
Workers complete timed "missions" (fire emergency, gas leak, machinery
lockout-tagout) by making real decisions in a 3D/AR scene instead of
answering MCQs. Every decision is scored, wrong choices trigger an
educational explanation (not just "❌ wrong"), and passing a mission issues
a QR-verifiable certificate. Admins get an actionable compliance dashboard
across sites, workers, and modules.

This document is the complete build procedure — follow it top to bottom and
you won't miss a step.

---

## 1. Why this stack

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router, TypeScript) | One codebase for the public site, the AR mission runner, the admin dashboard, and the API routes. Deploys as a normal website — no app store review needed for the hackathon demo. |
| AR | `@react-three/fiber` + `@react-three/xr` (WebXR) | Runs **in the browser**. On Chrome for Android it opens a real camera-based AR session (`immersive-ar`). On desktop/unsupported devices it gracefully falls back to an orbit-controlled 3D scene, so the mission is never blocked by hardware. |
| Styling | Tailwind CSS | Fast to theme consistently (see `tailwind.config.ts` for the SafeVerse palette). |
| Database | PostgreSQL + Prisma | Typed schema, easy migrations, works with any free-tier Postgres host (Supabase/Neon/Railway) for a hackathon demo. |
| Certificates | `qrcode` npm package | Generates the verification QR entirely server-side, no third-party API. |
| Charts | `recharts` | Dashboard bar charts / progress bars. |

Why **not** a native app: the brief's own "public verification webpage" and
judge-scans-it-themselves demo only works if this is a website. A website
also means zero install friction for workers on shared factory-floor
devices.

---

## 2. Project structure

```
safeverse/
├── app/
│   ├── page.tsx                     Landing page
│   ├── language/page.tsx            Step 2: language select (EN/HI/Santali)
│   ├── modules/page.tsx             Step 4: mission catalog
│   ├── mission/[missionId]/
│   │   ├── page.tsx                 Steps 5–8: AR scenario + assessment
│   │   └── summary/page.tsx         Step 9–10: score + pass/fail
│   ├── certificate/[certId]/page.tsx  Step 11: certificate + QR
│   ├── verify/[certId]/page.tsx     Step 12: PUBLIC QR verification page
│   └── dashboard/
│       ├── page.tsx                 Admin overview (alerts, site grid, chart)
│       ├── site/[siteId]/page.tsx   Site drill-down
│       └── worker/[workerId]/page.tsx  Worker competency profile
├── components/
│   ├── ARScene.tsx                  Core WebXR/3D hazard scene
│   └── FailureModal.tsx             "Incorrect decision" + why-did-you-pick-it flow
├── lib/
│   ├── scenarios.ts                 Mission content model (add missions here)
│   ├── scoring.ts                   Points engine + Safety Competency Score
│   ├── competency.ts                Decision-pattern analysis (the novel feature)
│   ├── db.ts                        Prisma client
│   └── qrcode.ts                    Certificate QR generation
├── prisma/schema.prisma             Database schema
├── tailwind.config.ts               Brand palette/tokens
└── .env.example                     Copy to .env
```

---

## 3. Feature → file map (so you can verify nothing from the brief was missed)

| Brief requirement | Where it lives |
|---|---|
| Fire / Gas / Machinery missions with emoji + timers | `lib/scenarios.ts` → `MISSIONS` |
| "You are inside an industrial area..." scenario framing, not MCQ | `MissionStep.prompt` in `lib/scenarios.ts`, rendered in `app/mission/[missionId]/page.tsx` |
| Point camera at flat surface / AR objects appear | `components/ARScene.tsx` (`ARButton`, WebXR session) |
| ⚠️ Incorrect decision + Try Again / View Explanation (not ❌ Wrong answer) | `components/FailureModal.tsx` |
| +20 correct / +10 fast / −15 unsafe scoring | `lib/scoring.ts` → `POINTS` |
| Safety Competency Score (5-axis, not X/10) | `lib/scoring.ts` → `buildCompetencyBreakdown` |
| Site heat-map (🟢🟡🔴) with drill-down | `app/dashboard/page.tsx`, `app/dashboard/site/[siteId]/page.tsx` |
| "🔴 Attention Required" actionable alerts | `app/dashboard/page.tsx` → `ALERTS` |
| Worker competency profile, strengths/weaknesses, recommended next mission | `lib/competency.ts` → `buildWorkerProfile`, `app/dashboard/worker/[workerId]/page.tsx` |
| "What made you choose it?" decision-pattern insight | `lib/competency.ts` → `tallyReasons`, wired through `FailureModal.tsx` |
| Timed/pressurized decisions | `MissionStep.timeLimitSeconds`, countdown timer in `app/mission/[missionId]/page.tsx` |
| Certificate + QR | `app/certificate/[certId]/page.tsx`, `lib/qrcode.ts` |
| Public QR verification webpage (judge-scannable) | `app/verify/[certId]/page.tsx` |
| Language select (Hindi/Santali/English) | `app/language/page.tsx` |

---

## 4. Step-by-step: get it running locally

### Step 1 — Install prerequisites
- Node.js 18.18+ (`node -v` to check)
- A Postgres database. Fastest free option for a hackathon: create one at
  [neon.tech](https://neon.tech) or [supabase.com](https://supabase.com) and
  copy the connection string.

### Step 2 — Create the project files
Take every file from this guide and place it at the matching path under a
new folder called `safeverse/` (the structure above shows exactly where
each one goes). If you're doing this by hand, create the folders first:

```bash
mkdir -p safeverse/app/language safeverse/app/modules \
  "safeverse/app/mission/[missionId]/summary" \
  "safeverse/app/dashboard/site/[siteId]" \
  "safeverse/app/dashboard/worker/[workerId]" \
  "safeverse/app/certificate/[certId]" \
  "safeverse/app/verify/[certId]" \
  safeverse/components safeverse/lib safeverse/prisma
```

### Step 3 — Install dependencies
```bash
cd safeverse
npm install
```

### Step 4 — Configure environment variables
```bash
cp .env.example .env
```
Open `.env` and paste your real `DATABASE_URL`. Leave `NEXT_PUBLIC_BASE_URL`
as-is for local dev, or set it to your deployed domain later.

### Step 5 — Set up the database
```bash
npx prisma migrate dev --name init
npx prisma generate
```
This creates the `Organization`, `Site`, `Worker`, `Mission`,
`MissionAttempt`, and `Certificate` tables from `prisma/schema.prisma`.

Seed a demo organization/site/worker (optional but recommended for a demo):
```bash
npx prisma studio
```
This opens a GUI at `http://localhost:5555` where you can add one
`Organization`, one `Site` under it, and one `Worker` under that site by
hand — fastest way to get demo data without writing a seed script.

### Step 6 — Run the dev server
```bash
npm run dev
```
Visit `http://localhost:3000`. You should be able to click through:
`/` → `/language` → `/modules` → `/mission/fire-l1` → `/mission/fire-l1/summary` → `/certificate/demo` → `/verify/demo`
→ `/dashboard` → `/dashboard/site/site-c` → `/dashboard/worker/worker-1`

### Step 7 — Test AR on a phone
WebXR AR only activates on a real device with camera access (Chrome on
Android is the most reliable target; iOS Safari does not support WebXR AR
as of this writing — on iPhone the scene falls back to the 3D orbit view
automatically, which is still fully playable).

To test on your phone during development:
```bash
npx next dev --experimental-https
```
then open the printed `https://<your-ip>:3000` URL on your phone (same
Wi-Fi network). WebXR requires HTTPS, which is why `--experimental-https`
matters here — plain `http://` will silently disable the AR button.

---

## 5. Wiring the parts that are currently "demo data"

To keep this guide runnable without you first standing up auth, a few
pages use inline demo data instead of live database queries. Each one has
a comment marking exactly what to replace:

1. **`app/mission/[missionId]/page.tsx` → `finishMission()`**
   Currently just redirects with score in the URL. Replace the `TODO` with
   a `POST /api/attempts` call that:
   - writes a `MissionAttempt` row via `db.missionAttempt.create(...)`
   - if `result.percentCorrect >= 70`, creates a `Certificate` row with a
     fresh `generateQrToken()` from `lib/qrcode.ts`

2. **`app/certificate/[certId]/page.tsx`**
   Replace the `demo` object with `db.certificate.findUnique({ where: { id: params.certId }, include: { worker: true } })`.

3. **`app/verify/[certId]/page.tsx`**
   Replace the `isRevoked`/`isExpired` string checks with a real lookup:
   `db.certificate.findUnique({ where: { qrToken: params.certId } })`, then
   check `.revoked` and `.expiresAt < new Date()`.

4. **`app/dashboard/page.tsx`, `site/[siteId]/page.tsx`, `worker/[workerId]/page.tsx`**
   Replace the hardcoded arrays with `db.site.findMany(...)` /
   `db.worker.findUnique(...)` queries, feeding results through
   `buildCompetencyBreakdown()` (`lib/scoring.ts`) and `buildWorkerProfile()`
   (`lib/competency.ts`) to compute the percentages shown.

5. **Auth / worker login (Step 3 in the brief's flow)**
   Not included here to keep the guide framework-agnostic. Fastest path for
   a hackathon: add [NextAuth.js](https://authjs.dev) with a simple
   employee-code + site credential, store the session, and replace
   `"demo-worker"` in `app/mission/[missionId]/page.tsx` with the real
   worker id.

---

## 6. Adding a new mission (e.g. "Confined Space — Level 1")

Everything reads from one file — you never touch the UI to add content:

1. Open `lib/scenarios.ts`.
2. Push a new object into the `MISSIONS` array following the existing
   `Mission` shape: title, emoji, level, one or more `steps`, each step's
   `choices` (mark exactly one `isCorrect: true` per step, or design it as
   multi-correct if you want partial credit — adjust `scoreMissionAttempt`
   in `lib/scoring.ts` if so), and a `reasonPrompt` array for the
   why-did-you-choose-it flow.
3. Add a matching row in the `Mission` table via `prisma/schema.prisma`
   seed data or Prisma Studio, using the same `id` string.
4. That's it — `/modules`, `/mission/[id]`, scoring, and the dashboard all
   pick it up automatically.

---

## 7. Swapping in real 3D/AR assets

`components/ARScene.tsx` currently draws colored boxes with text labels as
placeholders for: industrial environment, safety signs, PPE, exits,
emergency indicators, machinery, and hazard zones. To use real models:

1. Get `.glb`/`.gltf` models (Sketchfab, Kenney.nl, or commission/model
   your own) for each category above. Put them in `public/models/`.
2. In `ARScene.tsx`, replace the `<mesh><boxGeometry .../></mesh>` block
   inside `HazardObject` with a GLTF loader:
   ```tsx
   import { useGLTF } from "@react-three/drei";
   const { scene } = useGLTF(`/models/${spec.modelFile}`);
   return <primitive object={scene} />;
   ```
3. Add a `modelFile` field to `ARObjectSpec` and to each `MissionChoice` in
   `lib/scenarios.ts` so each choice points at its own model.

---

## 8. Deployment

**Frontend + API (Next.js):** [Vercel](https://vercel.com) is the fastest
path — connect the GitHub repo, set `DATABASE_URL` and
`NEXT_PUBLIC_BASE_URL` as environment variables in the Vercel dashboard,
deploy. WebXR requires HTTPS, which Vercel provides automatically.

**Database:** Neon or Supabase free tier is enough for a hackathon demo.
Run `npx prisma migrate deploy` against the production `DATABASE_URL`
after first deploy.

**Custom domain (optional, for a polished QR demo):** point a domain like
`safeverse.app` at Vercel, then set `NEXT_PUBLIC_BASE_URL` to match so
generated QR codes point at the real public URL, not `localhost`.

---

## 9. Login (Worker + Admin)

Both roles log in through the same mechanism — an "admin" is just a
`Worker` row with `role: ADMIN` or `SUPERVISOR` instead of `WORKER` (see
the `Role` enum in `prisma/schema.prisma`), so there's one login API and
one session cookie, with two front-end pages for two different audiences:

- `/login` — worker login (employee code + password), redirects to `/modules`
- `/admin/login` — admin/supervisor login, same fields, redirects to `/dashboard` and rejects worker-role accounts
- `middleware.ts` protects `/modules/*`, `/mission/*` (any logged-in account) and `/dashboard/*` (admin/supervisor only) — visiting them while logged out bounces you to the right login page automatically
- `/verify/[certId]` and `/certificate/[certId]` stay public/unauthenticated on purpose — a judge scanning a QR code has no account

**Demo credentials** (created by `npx prisma db seed`, see §4.3):

| Role | Employee code | Password |
|---|---|---|
| Worker | `DEMO-001` | `worker123` |
| Admin | `ADMIN-001` | `admin123` |

**Extra setup step:** add a `SESSION_SECRET` to your `.env` — a long random
string used to sign the login cookie. Generate one with:
```
openssl rand -base64 32
```
(On Windows without OpenSSL, any long random string works for local dev —
just don't reuse it in production.)

**If you already ran `npx prisma migrate dev` before this update:** the
`Worker` table just gained a required `passwordHash` column, which will
fail to migrate cleanly against existing rows with no password. Easiest
fix for a dev database with only demo data in it:
```
npx prisma migrate reset
```
This drops and recreates all tables, then re-runs the seed script
automatically. If you have real data you need to keep, add the column as
optional first, backfill it, then make it required in a second migration.

To add more real worker/admin accounts, either add rows to `prisma/seed.ts`
following the existing pattern (hash the password with `bcrypt.hash`
before storing it — never store plain text), or build a simple admin-only
"add worker" form that calls a new API route doing the same.

## 10. Demo script (for judges / stakeholders)

1. Open the site on a phone → language select → worker login (`DEMO-001` / `worker123`) → pick a mission.
2. Walk through the fire mission, deliberately pick a wrong exit → show the
   "⚠️ Incorrect decision" explanation flow and the "what made you choose
   it?" reason capture.
3. Retry, pick correctly, finish the mission → show the score breakdown and
   badge.
4. Open the certificate page, show the QR code.
5. **Hand your phone to a judge** and have them scan it themselves — it
   opens `/verify/[certId]` with no login required. This is the single
   most convincing live-demo moment in the whole flow.
6. Log out, sign in at `/admin/login` (`ADMIN-001` / `admin123`), then switch
   to `/dashboard` → point at the "Attention Required" panel, click
   into Site C, then into a worker profile to show the recommended next
   mission driven by their actual weak spots.

---

## 11. What's intentionally out of scope here

- Native mobile app / app-store distribution — a browser-based WebXR site
  covers the brief's AR requirement without that overhead.
- Full auth/RBAC system — stubbed with a `"demo-worker"` id and a note in
  §5 on where to add NextAuth.
- Production-grade 3D hazard models — placeholder geometry with a clear
  swap-in point (§7).
