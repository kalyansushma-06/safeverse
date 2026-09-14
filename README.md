# 🛡️ SafeVerse — AR Industrial Safety Training

> **Train for hazards. Make decisions. Learn from mistakes. Prove competency.**

SafeVerse is a **scenario-based, AR-powered industrial safety training and certification platform** designed to make safety training more immersive, practical, and measurable.

Instead of traditional MCQ-based learning, workers enter interactive **3D/AR safety missions** where they must make decisions under time pressure. Every decision is scored, unsafe choices trigger an educational explanation, and successful completion can generate a **QR-verifiable safety certificate**.

Administrators get a centralized dashboard to monitor **sites, workers, competency levels, alerts, strengths, weaknesses, and recommended training missions**.

---

## 🚨 The Problem

Traditional industrial safety training often relies heavily on:

* Static training material
* Lectures and videos
* MCQ-based assessments
* Limited real-world decision making
* Minimal analysis of *why* a worker made an unsafe choice
* Difficulty tracking competency across multiple sites

This creates a gap between **knowing safety rules** and **making the correct decision during an actual emergency**.

---

## 💡 Our Solution

SafeVerse transforms safety training into an interactive **"Safety Mission"** experience.

Workers don't simply answer:

> ❌ "Which option is correct?"

Instead, they are placed inside a simulated industrial scenario and asked to:

> 🎯 **Observe → Decide → Act → Learn → Improve**

Every mission combines:

* Interactive 3D/AR environments
* Time-pressured decisions
* Safety-focused scenarios
* Decision scoring
* Educational failure explanations
* Reason capture — *"What made you choose it?"*
* Competency analysis
* Certification
* Public QR verification

---

## 🎮 Safety Missions

SafeVerse currently structures training around scenario-based missions such as:

| Mission           | Scenario                                                   |
| ----------------- | ---------------------------------------------------------- |
| 🔥 Fire Emergency | Respond to an industrial fire and select the safest action |
| ☣️ Gas Leak       | Identify hazardous zones and respond appropriately         |
| ⚙️ Machinery      | Follow machinery safety / lockout-tagout procedures        |

Each mission can contain multiple timed decision steps.

The scenario framing is designed to feel like an actual industrial situation rather than a conventional quiz.

---

## ✨ Key Features

### 🥽 AR / 3D Safety Simulation

SafeVerse uses:

* `@react-three/fiber`
* `@react-three/xr`
* WebXR

On supported Android devices, the application can launch a camera-based `immersive-ar` experience.

On unsupported devices, SafeVerse falls back to an interactive **3D orbit-controlled environment**, ensuring the mission remains playable.

---

### ⏱️ Time-Pressured Decisions

Safety decisions happen under pressure.

Each mission step can define its own time limit, encouraging users to respond quickly while maintaining safe decision-making.

---

### 🧠 Decision-Based Learning

A wrong decision doesn't simply produce:

> ❌ Wrong Answer

Instead, SafeVerse explains **why the decision was unsafe** and allows the worker to learn from the mistake.

The system can also capture:

> **"What made you choose it?"**

This creates additional insight into the worker's decision-making patterns.

---

### 📊 Safety Competency Score

SafeVerse goes beyond a simple pass/fail score.

The scoring system produces a **Safety Competency Score** with a five-axis competency breakdown.

The scoring engine supports concepts such as:

* **+20** for a correct decision
* **+10** for a fast decision
* **−15** for an unsafe decision

This helps measure not only whether a worker completed a mission, but also how effectively they responded.

---

### 🚦 Site Safety Dashboard

Administrators can monitor safety performance across sites using:

* 🟢 Healthy
* 🟡 Attention Needed
* 🔴 Critical

The dashboard includes:

* Site-level performance
* Actionable alerts
* Worker competency profiles
* Strengths and weaknesses
* Recommended next missions
* Competency visualizations

---

### 👷 Worker Competency Profiles

Each worker can have a competency profile containing:

* Performance breakdown
* Strengths
* Weaknesses
* Decision patterns
* Mission performance
* Recommended next training mission

The recommendation system uses competency analysis to identify areas that require improvement.

---

### 🏆 Certification

After successfully completing a mission, SafeVerse can generate a certificate containing a QR code.

The QR code can lead to a **public verification page**, allowing a judge, supervisor, or other authorized viewer to verify the certificate without logging into the platform.

This makes certification immediately demonstrable during a live project demo.

---

### 🌐 Multilingual Support

SafeVerse includes a language selection flow supporting:

* 🇬🇧 English
* 🇮🇳 Hindi
* Santali

This is intended to make safety training more accessible to a wider worker population.

---

## 🔄 How SafeVerse Works

```text
                    ┌─────────────────┐
                    │   SafeVerse     │
                    │    Platform     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Language Select │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Worker Login   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Mission Catalog │
                    └────────┬────────┘
                             │
                             ▼
                 ┌────────────────────────┐
                 │ 3D / AR Safety Mission │
                 └───────────┬────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Make Decisions  │
                    │  Under Pressure │
                    └────────┬────────┘
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
              ✅ Safe Choice    ⚠️ Unsafe Choice
                    │                 │
                    │                 ▼
                    │        ┌──────────────────┐
                    │        │ Explanation +    │
                    │        │ Reason Capture   │
                    │        └────────┬─────────┘
                    │                 │
                    └────────┬────────┘
                             ▼
                    ┌─────────────────┐
                    │ Score & Analyze │
                    └────────┬────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │ Competency Profile  │
                  └──────────┬──────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Certification  │
                    │      + QR       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Public Verify   │
                    └─────────────────┘
```

---

## 🧑‍💼 Admin Workflow

Administrators and supervisors can use a separate dashboard to monitor the workforce.

```text
Admin Login
    │
    ▼
Dashboard
    │
    ├──► Site Overview
    │
    ├──► Safety Alerts
    │
    ├──► Site Drill-down
    │
    └──► Worker Profile
              │
              ├──► Competency
              ├──► Strengths
              ├──► Weaknesses
              └──► Recommended Mission
```

---

## 🏗️ Technology Stack

| Layer            | Technology                       | Purpose                           |
| ---------------- | -------------------------------- | --------------------------------- |
| Framework        | **Next.js 14**                   | Application, pages and API routes |
| Language         | **TypeScript**                   | Type-safe development             |
| UI               | **Tailwind CSS**                 | Responsive styling and theming    |
| 3D               | **React Three Fiber**            | Interactive 3D scenes             |
| AR               | **React Three XR / WebXR**       | Browser-based AR                  |
| Database         | **PostgreSQL**                   | Persistent application data       |
| ORM              | **Prisma**                       | Database schema and queries       |
| Charts           | **Recharts**                     | Dashboard visualizations          |
| QR               | **qrcode**                       | Server-side QR generation         |
| Authentication   | **Session-based authentication** | Worker/Admin access control       |
| Deployment       | **Vercel**                       | Next.js hosting                   |
| Database Hosting | **Neon / Supabase**              | PostgreSQL hosting                |

---

## 📁 Project Structure

```text
safeverse/
│
├── app/
│   ├── page.tsx
│   ├── language/
│   │   └── page.tsx
│   ├── modules/
│   │   └── page.tsx
│   ├── mission/
│   │   └── [missionId]/
│   │       ├── page.tsx
│   │       └── summary/
│   │           └── page.tsx
│   ├── certificate/
│   │   └── [certId]/
│   │       └── page.tsx
│   ├── verify/
│   │   └── [certId]/
│   │       └── page.tsx
│   └── dashboard/
│       ├── page.tsx
│       ├── site/
│       │   └── [siteId]/
│       │       └── page.tsx
│       └── worker/
│           └── [workerId]/
│               └── page.tsx
│
├── components/
│   ├── ARScene.tsx
│   └── FailureModal.tsx
│
├── lib/
│   ├── scenarios.ts
│   ├── scoring.ts
│   ├── competency.ts
│   ├── db.ts
│   └── qrcode.ts
│
├── prisma/
│   └── schema.prisma
│
├── tailwind.config.ts
├── .env.example
└── package.json
```

---

## 🔐 Authentication & Roles

SafeVerse supports two primary user experiences:

### 👷 Worker

```text
/login
```

Worker login uses:

* Employee code
* Password

Successful authentication redirects the worker to the mission catalog.

### 🧑‍💼 Admin / Supervisor

```text
/admin/login
```

Admin and supervisor accounts can access:

```text
/dashboard
```

The dashboard provides site and worker-level safety insights.

### 🌍 Public Verification

Certificate verification remains public:

```text
/verify/[certId]
```

This allows someone scanning a certificate QR code to verify it without creating an account.

---

## 🧪 Demo Credentials

For the included demo environment:

| Role   | Employee Code | Password    |
| ------ | ------------- | ----------- |
| Worker | `DEMO-001`    | `worker123` |
| Admin  | `ADMIN-001`   | `admin123`  |

> ⚠️ These credentials are intended only for the demo environment. Never use demo credentials or plain-text passwords in a production deployment.

---

## 🚀 Getting Started

### 1. Prerequisites

Install:

* Node.js **18.18+**
* PostgreSQL database

A free PostgreSQL database can be created using a service such as Neon or Supabase.

---

### 2. Clone the Repository

```bash
git clone <your-repository-url>
cd safeverse
```

---

### 3. Install Dependencies

```bash
npm install
```

---

### 4. Configure Environment Variables

Create your environment file:

```bash
cp .env.example .env
```

Configure the required database connection:

```env
DATABASE_URL="your-postgresql-connection-string"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
SESSION_SECRET="your-random-secret"
```

Do **not** commit `.env` to GitHub.

---

### 5. Initialize Prisma

Run:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

For the demo database, the project can also use its Prisma seed configuration where available.

---

### 6. Start the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 📱 Testing AR

WebXR AR requires a compatible device and camera access.

The most reliable target is:

> **Android + Chrome**

For local phone testing:

```bash
npx next dev --experimental-https
```

Open the generated HTTPS URL on a phone connected to the same Wi-Fi network.

HTTPS is required because WebXR AR needs a secure context.

On unsupported devices, SafeVerse automatically falls back to the interactive 3D scene.

---

## 🧩 Adding New Missions

Mission content is centralized in:

```text
lib/scenarios.ts
```

A mission can define:

* Title
* Emoji
* Level
* Multiple steps
* Choices
* Correct choices
* Time limits
* Reason prompts
* AR objects

The mission system is designed so new scenarios can be added without rebuilding the entire UI.

Potential future missions include:

```text
🔥 Fire Emergency
☣️ Gas Leak
⚙️ Machinery Lockout-Tagout
🚪 Confined Space
⚡ Electrical Hazard
```

---

## 🥽 3D / AR Assets

The current AR scene uses placeholder geometry representing:

* Industrial environment
* Safety signs
* PPE
* Emergency exits
* Emergency indicators
* Machinery
* Hazard zones

Real `.glb` / `.gltf` assets can be added under:

```text
public/models/
```

The `ARScene.tsx` component provides the integration point for replacing placeholder geometry with real 3D models.

---

## ☁️ Deployment

### Frontend + API

The Next.js application can be deployed through **Vercel**.

Required environment variables:

```text
DATABASE_URL
NEXT_PUBLIC_BASE_URL
SESSION_SECRET
```

WebXR requires HTTPS, which is provided automatically by Vercel.

### Database

PostgreSQL can be hosted using:

* Neon
* Supabase

After deployment, run:

```bash
npx prisma migrate deploy
```

against the production database.

---

## 🎬 Suggested Demo Flow

For a hackathon or stakeholder presentation, the recommended demo sequence is:

### 1️⃣ Start the Mission

Open SafeVerse on a phone and select a language.

### 2️⃣ Worker Login

Use the demo worker account and select a safety mission.

### 3️⃣ Enter the Scenario

Launch the fire emergency mission and enter the interactive 3D/AR environment.

### 4️⃣ Make a Wrong Decision

Deliberately select an unsafe exit.

Show:

```text
⚠️ Incorrect Decision
Why was this unsafe?
What made you choose it?
Try Again
View Explanation
```

### 5️⃣ Complete Successfully

Retry the mission and make the correct decisions.

Show:

* Score
* Competency breakdown
* Badge
* Mission result

### 6️⃣ Generate Certificate

Open the certificate page and display the QR code.

### 7️⃣ Verify the Certificate

Have the judge scan the QR code using their own device.

The QR opens the public verification page without requiring login.

### 8️⃣ Show the Admin Dashboard

Log in as an administrator and demonstrate:

```text
Dashboard
   ↓
Attention Required
   ↓
Site C
   ↓
Worker Profile
   ↓
Weakness Analysis
   ↓
Recommended Next Mission
```

This demonstrates the complete **training → assessment → certification → analytics** loop.

---

## 📊 Feature Coverage

| Capability             | Implementation                |
| ---------------------- | ----------------------------- |
| 🔥 Fire Mission        | `lib/scenarios.ts`            |
| ☣️ Gas Leak Mission    | `lib/scenarios.ts`            |
| ⚙️ Machinery Mission   | `lib/scenarios.ts`            |
| 🥽 WebXR / AR          | `components/ARScene.tsx`      |
| ⚠️ Failure Explanation | `components/FailureModal.tsx` |
| ⏱️ Timed Decisions     | Mission step timer            |
| 🧮 Scoring Engine      | `lib/scoring.ts`              |
| 🧠 Competency Analysis | `lib/competency.ts`           |
| 🚦 Site Heat Map       | Dashboard                     |
| 🔴 Safety Alerts       | Dashboard                     |
| 👷 Worker Profiles     | Dashboard                     |
| 🏆 Certificates        | Certificate module            |
| 📱 QR Verification     | Public verification route     |
| 🌐 Languages           | Language selection            |
| 🔐 Worker/Admin Login  | Authentication flow           |

---

## 🔮 Future Scope

SafeVerse can be expanded beyond the current prototype with:

* More industrial safety missions
* Realistic 3D industrial environments
* Expanded AR object interactions
* Additional regional languages
* Advanced competency analytics
* Organization-level reporting
* More granular role-based access
* Real-time training analytics
* Larger mission libraries
* Advanced worker performance recommendations

---

## 🎯 Why SafeVerse?

SafeVerse changes safety training from:

```text
Read → Watch → Answer → Forget
```

into:

```text
Experience → Decide → Fail → Understand → Retry → Improve → Prove
```

The goal is not simply to test whether a worker **knows** a safety rule.

The goal is to understand whether they can **apply it when it matters**.

---

## 🏆 Hackathon Value Proposition

### For Workers

* More engaging than traditional LMS training
* Practical decision-making
* Immediate feedback
* Gamified missions
* Verifiable certification

### For Supervisors

* Identify weak competencies
* Monitor site performance
* Detect recurring unsafe decision patterns
* Assign targeted training

### For Organizations

* Centralized safety visibility
* Competency-based training
* Digital certification
* Scalable scenario library
* Browser-based deployment with minimal installation friction

---

## 👥 Team

**SafeVerse** is developed as an interactive industrial safety training solution focused on combining:

> **AR + Gamification + Competency Analytics + Certification**

---

## 📄 License

Add your preferred project license here, such as:

```text
MIT License
```

---

## ⭐ Support the Project

If you find SafeVerse interesting, consider giving the repository a ⭐ and sharing your feedback.

**SafeVerse — Don't just learn safety. Experience it.**
