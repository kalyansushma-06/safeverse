import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-void text-paper flex flex-col">
      <header className="flex items-center justify-between px-8 py-6 border-b border-steelLine">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛡️</span>
          <span className="display text-xl font-bold tracking-tight">SafeVerse</span>
        </div>
        <nav className="hidden md:flex gap-6 mono text-sm text-mist">
          <Link href="/login">Worker Login</Link>
          <Link href="/admin/login">Admin Login</Link>
        </nav>
      </header>

      <section className="flex-1 grid md:grid-cols-2 gap-10 px-8 py-16 items-center max-w-6xl mx-auto">
        <div>
          <p className="mono text-signal text-sm mb-4">Industrial safety, rebuilt as a mission</p>
          <h1 className="display text-5xl font-bold leading-tight mb-6">
            Train for the hazard
            <br />
            before it's real.
          </h1>
          <p className="text-mist text-lg mb-8 max-w-md">
            SafeVerse turns fire drills, gas leaks, and machinery procedures into
            AR missions your workers actually remember — scored on decisions,
            not multiple choice.
          </p>
          <div className="flex gap-4">
            <Link
              href="/language"
              className="bg-signal text-void font-semibold px-6 py-3 rounded-panel hover:brightness-110 transition"
            >
              Start Training
            </Link>
            <Link
              href="/dashboard"
              className="border border-steelLine px-6 py-3 rounded-panel text-mist hover:border-signal hover:text-paper transition"
            >
              Admin dashboard
            </Link>
          </div>
        </div>

        <div className="bg-steel border border-steelLine rounded-panel p-6">
          <p className="mono text-xs text-mist mb-4">LIVE MISSION PREVIEW</p>
          <div className="space-y-3">
            <MissionPreviewRow emoji="🔥" title="Fire Emergency" sub="90 second evacuation decision" />
            <MissionPreviewRow emoji="☣️" title="Gas Leak" sub="Hazard zone identification" />
            <MissionPreviewRow emoji="🏭" title="Industrial Floor" sub="Lockout-tagout procedure" />
          </div>
        </div>
      </section>
    </main>
  );
}

function MissionPreviewRow({ emoji, title, sub }: { emoji: string; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-4 bg-void border border-steelLine rounded-panel p-4">
      <span className="text-2xl">{emoji}</span>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-mist text-sm">{sub}</p>
      </div>
    </div>
  );
}
