"use client";

import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { getMissionById } from "@/lib/scenarios";

const PASS_THRESHOLD_PERCENT = 70;

export default function MissionSummaryPage() {
  const { missionId } = useParams<{ missionId: string }>();
  const search = useSearchParams();
  const mission = getMissionById(missionId);

  const points = Number(search.get("points") ?? 0);
  const max = Number(search.get("max") ?? 1);
  const percent = Number(search.get("percent") ?? 0);
  const badge = search.get("badge") ?? "";
  const certId = search.get("certId") ?? "";
  const saved = search.get("saved") !== "0";
  const passed = percent >= PASS_THRESHOLD_PERCENT;

  return (
    <main className="min-h-screen bg-void text-paper flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <p className="mono text-xs text-mist mb-2">{mission?.title ?? "Mission"} complete</p>
        <h1 className="display text-4xl font-bold mb-1">{points} pts</h1>
        <p className="text-mist mb-8">{points} / {max} available points · {percent}% correct</p>

        {!saved && (
          <p className="text-caution text-sm bg-caution/10 border border-caution/40 rounded-panel p-3 mb-6">
            This score wasn't saved to the database (the save request failed). It won't show up on the
            dashboard or certificate. Check your dev server terminal for the error.
          </p>
        )}

        <div
          className={`rounded-panel border p-6 mb-8 ${
            passed ? "border-safe bg-safe/10" : "border-danger bg-danger/10"
          }`}
        >
          <p className="text-2xl font-bold mb-1">{passed ? "🏆 Passed" : "❌ Not yet passed"}</p>
          {passed ? (
            <p className="text-mist text-sm">
              Badge earned: <span className="text-paper font-semibold">{badge}</span>
            </p>
          ) : (
            <p className="text-mist text-sm">
              Score {PASS_THRESHOLD_PERCENT}% or higher to earn the badge and certificate.
            </p>
          )}
        </div>

        <div className="flex gap-3 justify-center">
          {passed && certId ? (
            <Link
              href={`/certificate/${certId}`}
              className="bg-signal text-void font-semibold px-6 py-3 rounded-panel hover:brightness-110 transition"
            >
              View Certificate
            </Link>
          ) : (
            <Link
              href={`/mission/${missionId}`}
              className="bg-signal text-void font-semibold px-6 py-3 rounded-panel hover:brightness-110 transition"
            >
              Retry Mission
            </Link>
          )}
          <Link
            href="/modules"
            className="border border-steelLine px-6 py-3 rounded-panel text-mist hover:border-paper hover:text-paper transition"
          >
            All Missions
          </Link>
        </div>
      </div>
    </main>
  );
}
