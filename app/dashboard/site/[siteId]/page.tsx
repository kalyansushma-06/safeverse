"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

// Demo data — replace with a fetch to /api/sites/[siteId] backed by Prisma.
const SITE_DETAIL: Record<string, { name: string; metrics: { label: string; value: number }[] }> = {
  "site-c": {
    name: "Site C",
    metrics: [
      { label: "Fire recognition", value: 61 },
      { label: "PPE selection", value: 72 },
      { label: "Emergency response", value: 54 }
    ]
  }
};

export default function SiteDetailPage() {
  const { siteId } = useParams<{ siteId: string }>();
  const site = SITE_DETAIL[siteId] ?? { name: siteId, metrics: [] };

  return (
    <main className="min-h-screen bg-void text-paper px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="mono text-xs text-mist hover:text-paper">
          ← Overview
        </Link>
        <h1 className="display text-3xl font-bold mt-2 mb-8">{site.name}</h1>

        <div className="space-y-4">
          {site.metrics.map((m) => (
            <div key={m.label}>
              <div className="flex justify-between text-sm mb-1">
                <span>{m.label}</span>
                <span className="mono">{m.value}%</span>
              </div>
              <div className="h-2 bg-steelLine rounded-full overflow-hidden">
                <div
                  className={`h-full ${m.value < 60 ? "bg-danger" : m.value < 80 ? "bg-caution" : "bg-safe"}`}
                  style={{ width: `${m.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {site.metrics.some((m) => m.value < 60) && (
          <p className="mt-8 text-sm text-danger bg-danger/10 border border-danger/40 rounded-panel p-4">
            Training intervention recommended: emergency response scores are below the 60% safety threshold.
          </p>
        )}
      </div>
    </main>
  );
}
