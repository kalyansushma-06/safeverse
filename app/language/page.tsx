"use client";
import { useRouter } from "next/navigation";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी (Hindi)" },
  { code: "sat", label: "ᱥᱟᱱᱛᱟᱲᱤ (Santali)" }
];

export default function LanguagePage() {
  const router = useRouter();

  function selectLanguage(code: string) {
    // Persisted worker-side; in production write to session/cookie or the
    // Worker row via a server action once auth exists.
    document.cookie = `sv_lang=${code}; path=/; max-age=31536000`;
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-void text-paper flex items-center justify-center px-6">
      <div className="max-w-sm w-full">
        <h1 className="display text-2xl font-bold mb-2 text-center">Choose your language</h1>
        <p className="text-mist text-sm text-center mb-8">भाषा चुनें · ᱯᱟᱹᱨᱥᱤ ᱵᱟᱪᱷᱟᱣ ᱢᱮ</p>
        <div className="space-y-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => selectLanguage(lang.code)}
              className="w-full bg-steel border border-steelLine rounded-panel py-4 text-lg hover:border-signal transition"
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
