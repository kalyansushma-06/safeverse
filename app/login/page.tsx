"use client";

import { useState, FormEvent, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { getTranslations, Language } from "@/lib/i18n";

function WorkerLoginForm() {
  const router = useRouter();
  const search = useSearchParams();

  const [employeeCode, setEmployeeCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [language, setLanguage] = useState<Language>("en");

  // Load the language selected on the language page
  useEffect(() => {
    // First check localStorage
    const saved = localStorage.getItem("sv_lang");

    if (saved === "en" || saved === "hi" || saved === "sat") {
      setLanguage(saved as Language);
      return;
    }

    // Fallback to cookie
    const match = document.cookie.match(/(?:^|;\s*)sv_lang=([^;]+)/);

    if (
      match &&
      (match[1] === "en" ||
        match[1] === "hi" ||
        match[1] === "sat")
    ) {
      setLanguage(match[1] as Language);
    }
  }, []);

  const t = getTranslations(language);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          employeeCode,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return;
      }

      router.push(search.get("next") ?? "/modules");
    } catch {
      setError(
        language === "hi"
          ? "सर्वर से संपर्क नहीं हो सका। क्या dev server चल रहा है?"
          : language === "sat"
          ? "ᱥᱟᱨᱵᱷᱟᱨ ᱥᱟᱶ ᱡᱚᱯᱚᱲ ᱵᱟᱝ ᱦᱩᱭᱮᱱᱟ᱾ ᱰᱮᱵᱽ ᱥᱟᱨᱵᱷᱟᱨ ᱪᱟᱹᱞᱩ ᱢᱮᱱᱟ?"
          : "Couldn't reach the server. Is the dev server running?"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-void text-paper flex items-center justify-center px-6">
      <div className="max-w-sm w-full">

        {/* Icon */}
        <p className="text-center text-2xl mb-2">👷</p>

        {/* Title */}
        <h1 className="display text-2xl font-bold mb-1 text-center">
          {t.login}
        </h1>

        {/* Subtitle */}
        <p className="text-mist text-sm text-center mb-8">
          {language === "en"
            ? "Enter your employee code to begin training."
            : language === "hi"
            ? "प्रशिक्षण शुरू करने के लिए अपना कर्मचारी कोड दर्ज करें।"
            : "ᱥᱤᱠᱷᱱᱟ ᱮᱦᱚᱵ ᱞᱟᱹᱜᱤᱫ ᱟᱢᱟᱜ ᱠᱟᱹᱢᱤ ᱠᱳᱰ ᱵᱚᱞᱚᱭ ᱢᱮ᱾"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Employee Code */}
          <div>
            <label className="text-xs mono text-mist block mb-1">
              {t.employeeCode}
            </label>

            <input
              value={employeeCode}
              onChange={(e) => setEmployeeCode(e.target.value)}
              placeholder={
                language === "en"
                  ? "e.g. DEMO-001"
                  : language === "hi"
                  ? "जैसे DEMO-001"
                  : "ᱡᱮᱞᱮᱠᱟ DEMO-001"
              }
              className="w-full bg-steel border border-steelLine rounded-panel px-4 py-3 outline-none focus:border-signal transition"
              autoComplete="username"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-xs mono text-mist block mb-1">
              {t.password}
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-steel border border-steelLine rounded-panel px-4 py-3 outline-none focus:border-signal transition"
              autoComplete="current-password"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-danger text-sm">
              {error}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-signal text-void font-semibold py-3 rounded-panel hover:brightness-110 transition disabled:opacity-60"
          >
            {loading
              ? language === "en"
                ? "Signing in…"
                : language === "hi"
                ? "लॉगिन हो रहा है…"
                : "ᱞᱚᱜᱤᱱ ᱦᱚᱭ ᱮᱫᱟ…"
              : t.loginButton}
          </button>
        </form>

        {/* Admin Login */}
        <p className="text-mist text-xs text-center mt-6">
          {language === "en"
            ? "Site supervisor or admin?"
            : language === "hi"
            ? "साइट सुपरवाइज़र या एडमिन?"
            : "ᱥᱟᱭᱤᱴ ᱥᱩᱯᱟᱨᱵᱟᱭᱡᱟᱨ ᱟᱨᱵᱟ ᱮᱰᱢᱤᱱ?"}{" "}

          <Link
            href="/admin/login"
            className="text-signal hover:underline"
          >
            {language === "en"
              ? "Admin login"
              : language === "hi"
              ? "एडमिन लॉगिन"
              : "ᱮᱰᱢᱤᱱ ᱞᱚᱜᱤᱱ"}
          </Link>
        </p>

      </div>
    </main>
  );
}

export default function WorkerLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-void text-paper flex items-center justify-center px-6">
          <p className="text-mist text-sm">
            Loading...
          </p>
        </main>
      }
    >
      <WorkerLoginForm />
    </Suspense>
  );
}