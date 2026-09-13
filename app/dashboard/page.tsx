"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import LogoutButton from "@/components/LogoutButton";

// Demo data shaped exactly like what the /api/dashboard route should return
// once wired to Prisma (see lib/db.ts + prisma/schema.prisma).
const ALERTS = [
  { icon: "🔴", text: "24 workers haven't completed Gas Safety" },
  { icon: "🔴", text: "17 certificates expiring soon" },
  { icon: "🟡", text: "9 workers failed assessment twice" }
];

const SITES = [
  { id: "site-a", name: "Site A", status: "GREEN" as const },
  { id: "site-b", name: "Site B", status: "YELLOW" as const },
  { id: "site-c", name: "Site C", status: "RED" as const },
  { id: "site-d", name: "Site D", status: "GREEN" as const }
];

const FAILURE_RATE_BY_MODULE = [
  { module: "Fire", failRate: 12 },
  { module: "Gas", failRate: 34 },
  { module: "Machinery", failRate: 21 },
  { module: "Confined Space", failRate: 45 }
];

const STATUS_COLOR: Record<string, string> = {
  GREEN: "bg-safe",
  YELLOW: "bg-caution",
  RED: "bg-danger"
};

export default function DashboardPage() {
  const [adminName, setAdminName] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => setAdminName(data?.session?.name ?? null))
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-void text-paper px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="display text-3xl font-bold">Compliance Dashboard</h1>
            <p className="text-mist">Jharkhand sites · updated live</p>
          </div>
          <div className="flex items-center gap-5">
            <nav className="mono text-sm text-mist flex gap-5">
              <Link href="/dashboard">Overview</Link>
              <Link href="/dashboard/site/site-c">Sites</Link>
            </nav>
            <div className="flex items-center gap-4 border-l border-steelLine pl-5">
              {adminName && <span className="mono text-xs text-mist">🛡️ {adminName}</span>}
              <LogoutButton redirectTo="/admin/login" />
            </div>
          </div>
        </div>

        {/* Actionable alert panel — the brief is explicit this must not be a bare number grid */}
        <div className="bg-steel border border-danger/40 rounded-panel p-5 mb-8">
          <p className="mono text-xs text-danger mb-3">ATTENTION REQUIRED</p>
          <ul className="space-y-2">
            {ALERTS.map((a, i) => (
              <li key={i} className="flex items-center gap-3">
                <span>{a.icon}</span>
                <span>{a.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Site status grid */}
          <div className="bg-steel border border-steelLine rounded-panel p-5">
            <p className="mono text-xs text-mist mb-4">SITE STATUS</p>
            <div className="space-y-3">
              {SITES.map((site) => (
                <Link
                  key={site.id}
                  href={`/dashboard/site/${site.id}`}
                  className="flex items-center justify-between bg-void border border-steelLine rounded-panel px-4 py-3 hover:border-signal transition"
                >
                  <span>{site.name}</span>
                  <span className={`w-3 h-3 rounded-full ${STATUS_COLOR[site.status]}`} />
                </Link>
              ))}
            </div>
          </div>

          {/* Failure rate by module */}
          <div className="bg-steel border border-steelLine rounded-panel p-5">
            <p className="mono text-xs text-mist mb-4">FAILURE RATE BY MODULE</p>
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <BarChart data={FAILURE_RATE_BY_MODULE}>
                  <XAxis dataKey="module" stroke="#AEB9CF" fontSize={12} />
                  <YAxis stroke="#AEB9CF" fontSize={12} unit="%" />
                  <Tooltip contentStyle={{ background: "#131C2E", border: "1px solid #22304A" }} />
                  <Bar dataKey="failRate" fill="#FF7A1A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
