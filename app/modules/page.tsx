import Link from "next/link";
import { MISSIONS } from "@/lib/scenarios";
import { getSession } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

export default async function ModulesPage() {
  const session = await getSession(); // middleware guarantees this is non-null here

  return (
    <main className="min-h-screen bg-void text-paper px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="display text-3xl font-bold">Safety Modules</h1>
          <div className="flex items-center gap-4">
            {session && <span className="mono text-xs text-mist">👷 {session.name}</span>}
            <LogoutButton redirectTo="/login" />
          </div>
        </div>
        <p className="text-mist mb-10">Pick a mission. Each one is scenario-based, timed, and scored.</p>

        <div className="grid sm:grid-cols-2 gap-5">
          {MISSIONS.map((mission) => (
            <Link
              key={mission.id}
              href={`/mission/${mission.id}`}
              className="bg-steel border border-steelLine rounded-panel p-6 hover:border-signal transition group"
            >
              <span className="text-3xl">{mission.emoji}</span>
              <h2 className="display text-xl font-bold mt-4">{mission.title}</h2>
              <p className="text-mist text-sm mt-2">{mission.description}</p>
              <p className="mono text-xs text-signal mt-4 group-hover:underline">
                Level {mission.level} · {mission.steps.length} decisions →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
