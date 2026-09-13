"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function WorkerLoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const [employeeCode, setEmployeeCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeCode, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return;
      }
      router.push(search.get("next") ?? "/modules");
    } catch {
      setError("Couldn't reach the server. Is the dev server running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-void text-paper flex items-center justify-center px-6">
      <div className="max-w-sm w-full">
        <p className="text-center text-2xl mb-2">👷</p>
        <h1 className="display text-2xl font-bold mb-1 text-center">Worker Login</h1>
        <p className="text-mist text-sm text-center mb-8">Enter your employee code to begin training.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs mono text-mist block mb-1">Employee code</label>
            <input
              value={employeeCode}
              onChange={(e) => setEmployeeCode(e.target.value)}
              placeholder="e.g. DEMO-001"
              className="w-full bg-steel border border-steelLine rounded-panel px-4 py-3 outline-none focus:border-signal transition"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="text-xs mono text-mist block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-steel border border-steelLine rounded-panel px-4 py-3 outline-none focus:border-signal transition"
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-danger text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-signal text-void font-semibold py-3 rounded-panel hover:brightness-110 transition disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-mist text-xs text-center mt-6">
          Site supervisor or admin?{" "}
          <Link href="/admin/login" className="text-signal hover:underline">
            Admin login
          </Link>
        </p>
      </div>
    </main>
  );
}
