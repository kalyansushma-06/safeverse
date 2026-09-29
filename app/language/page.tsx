"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const LANGUAGES = [
  {
    code: "en",
    label: "English",
    nativeLabel: "English",
  },
  {
    code: "hi",
    label: "Hindi",
    nativeLabel: "हिन्दी",
  },
  {
    code: "sat",
    label: "Santali",
    nativeLabel: "ᱥᱟᱱᱛᱟᱲᱤ",
  },
] as const;

type LanguageCode = (typeof LANGUAGES)[number]["code"];

export default function LanguagePage() {
  const router = useRouter();

  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageCode>("en");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sv_lang");

    if (
      saved === "en" ||
      saved === "hi" ||
      saved === "sat"
    ) {
      setSelectedLanguage(saved);
    }
  }, []);

  function selectLanguage(code: LanguageCode) {
    setSelectedLanguage(code);
    setLoading(true);

    /*
     * Save in localStorage.
     */
    localStorage.setItem("sv_lang", code);

    /*
     * Save in cookie.
     */
    document.cookie = `sv_lang=${code}; path=/; max-age=31536000; SameSite=Lax`;

    /*
     * Go to login after saving.
     */
    setTimeout(() => {
      router.push("/login");
      router.refresh();
    }, 200);
  }

  return (
    <main className="min-h-screen bg-void text-paper flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        <div className="text-center mb-10">
          <div className="text-5xl mb-5">
            🌐
          </div>

          <h1 className="display text-3xl font-bold mb-3">
            Choose your language
          </h1>

          <p className="text-mist text-sm">
            भाषा चुनें · ᱯᱟᱹᱨᱥᱤ ᱵᱟᱪᱷᱟᱣ ᱢᱮ
          </p>
        </div>

        <div className="space-y-4">
          {LANGUAGES.map((language) => {
            const isSelected =
              selectedLanguage === language.code;

            return (
              <button
                key={language.code}
                type="button"
                disabled={loading}
                onClick={() =>
                  selectLanguage(language.code)
                }
                className={`
                  w-full rounded-panel border
                  px-5 py-5
                  flex items-center justify-between
                  transition-all duration-200
                  ${
                    isSelected
                      ? "border-signal bg-signal/10"
                      : "border-steelLine bg-steel hover:border-signal"
                  }
                  ${
                    loading
                      ? "cursor-wait opacity-70"
                      : "cursor-pointer"
                  }
                `}
              >
                <div className="text-left">
                  <p className="font-semibold text-lg">
                    {language.nativeLabel}
                  </p>

                  <p className="text-mist text-sm mt-1">
                    {language.label}
                  </p>
                </div>

                <div
                  className={`
                    w-6 h-6 rounded-full border
                    flex items-center justify-center
                    ${
                      isSelected
                        ? "border-signal bg-signal text-void"
                        : "border-steelLine"
                    }
                  `}
                >
                  {isSelected ? "✓" : ""}
                </div>
              </button>
            );
          })}
        </div>

        {loading && (
          <p className="text-center text-signal text-sm mt-6">
            Loading SafeVerse...
          </p>
        )}

        <p className="text-center text-mist text-xs mt-8">
          Your language preference will be saved on this device.
        </p>

      </div>
    </main>
  );
}