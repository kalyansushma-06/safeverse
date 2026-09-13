"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

// Demo data shaped like the output of lib/competency.ts buildWorkerProfile().
// Replace with a fetch to /api/workers/[workerId]/profile.
const DEMO_PROFILE = {
  name: "Worker A",
  strengths: ["PPE selection", "Exit identification"],
  weaknesses: ["Emergency sequencing", "Gas-zone recognition"],
  dominantPatterns: [
    "Worker tends to choose the shortest route without checking hazard conditions."
  ],
  recommendedNextMission: { id: "gas-l1", label: "☣️ Gas Leak — Level 1" }
};

export default function WorkerProfilePage() {
  const { workerId } = useParams<{ workerId: string }>();

  return (
    <main className="min-h-screen bg-void text-paper px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="mono text-xs text-mist hover:text-paper">
          ← Overview
        </Link>
        <h1 className="display text-3xl font-bold mt-2 mb-1">👷 {DEMO_PROFILE.name}</h1>
        <p className="text-mist mb-8 mono text-xs">{workerId}</p>

        <div className="grid sm:grid-cols-2 gap-5 mb-8">
          <div className="bg-steel border border-safe/40 rounded-panel p-5">
            <p className="mono text-xs text-safe mb-3">STRONG</p>
            <ul className="space-y-1">
              {DEMO_PROFILE.strengths.map((s) => (
                <li key={s}>✔ {s}</li>
              ))}
            </ul>
          </div>
          <div className="bg-steel border border-danger/40 rounded-panel p-5">
            <p className="mono text-xs text-danger mb-3">WEAK</p>
            <ul className="space-y-1">
              {DEMO_PROFILE.weaknesses.map((w) => (
                <li key={w}>✖ {w}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-steel border border-steelLine rounded-panel p-5 mb-8">
          <p className="mono text-xs text-mist mb-3">DECISION PATTERN</p>
          {DEMO_PROFILE.dominantPatterns.map((p) => (
            <p key={p} className="text-mist">
              ⚠️ {p}
            </p>
          ))}
        </div>

        <Link
          href={`/mission/${DEMO_PROFILE.recommendedNextMission.id}`}
          className="block bg-signal text-void font-semibold text-center px-6 py-4 rounded-panel hover:brightness-110 transition"
        >
          Recommended next mission: {DEMO_PROFILE.recommendedNextMission.label} →
        </Link>
      </div>
    </main>
  );
}
