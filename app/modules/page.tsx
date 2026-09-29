import Link from "next/link";
import { cookies } from "next/headers";

import { getSession } from "@/lib/auth";
import { getTranslations, Language } from "@/lib/i18n";
import { getLocalizedMissions } from "@/lib/scenarioTranslations";

import LogoutButton from "@/components/LogoutButton";

export default async function ModulesPage() {
  const session = await getSession();

  const cookieStore = cookies();
  const savedLanguage = cookieStore.get("sv_lang")?.value;

  const language: Language =
    savedLanguage === "hi" || savedLanguage === "sat"
      ? savedLanguage
      : "en";

  const t = getTranslations(language);

  // Get missions translated into the selected language
  const missions = getLocalizedMissions(language);

  const pageText = {
    en: {
      title: "Safety Modules",
      subtitle:
        "Pick a mission. Each one is scenario-based, timed, and scored.",
      level: "Level",
      decisions: "decisions",
      logout: "Logout"
    },

    hi: {
      title: "सुरक्षा मॉड्यूल",
      subtitle:
        "एक मिशन चुनें। प्रत्येक मिशन परिस्थिति-आधारित, समयबद्ध और स्कोर किया गया है।",
      level: "स्तर",
      decisions: "निर्णय",
      logout: "लॉगआउट"
    },

    sat: {
      title: "ᱥᱟᱞᱟᱢᱟᱹᱛ ᱢᱳᱰᱩᱞ",
      subtitle:
        "ᱢᱤᱥᱚᱱ ᱢᱤᱫ ᱵᱟᱪᱷᱟᱣ ᱢᱮ। ᱡᱚᱛᱚ ᱢᱤᱥᱚᱱ ᱥᱤᱱᱟᱹᱱ ᱵᱟᱝᱜᱟᱹᱱ, ᱚᱠᱛᱚ ᱟᱨ ᱥᱠᱳᱨ ᱛᱮ ᱦᱩᱭᱩᱜᱼᱟ᱾",
      level: "ᱥᱛᱟᱨ",
      decisions: "ᱵᱟᱪᱷᱟᱣ",
      logout: "ᱞᱚᱜᱟᱣᱩᱴ"
    }
  };

  const text = pageText[language];

  return (
    <main className="min-h-screen bg-void text-paper px-6 py-12">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="display text-3xl font-bold">
            {text.title}
          </h1>

          <div className="flex items-center gap-4">
            {session && (
              <span className="mono text-xs text-mist">
                👷 {session.name}
              </span>
            )}

            <LogoutButton redirectTo="/login" />
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-mist mb-10">
          {text.subtitle}
        </p>

        {/* Mission cards */}
        <div className="grid sm:grid-cols-2 gap-5">
          {missions.map((mission) => (
            <Link
              key={mission.id}
              href={`/mission/${mission.id}`}
              className="bg-steel border border-steelLine rounded-panel p-6 hover:border-signal transition group"
            >
              {/* Mission emoji */}
              <span className="text-3xl">
                {mission.emoji}
              </span>

              {/* Mission title */}
              <h2 className="display text-xl font-bold mt-4">
                {mission.title}
              </h2>

              {/* Mission description */}
              <p className="text-mist text-sm mt-2">
                {mission.description}
              </p>

              {/* Mission information */}
              <p className="mono text-xs text-signal mt-4 group-hover:underline">
                {text.level} {mission.level} ·{" "}
                {mission.steps.length} {text.decisions} →
              </p>
            </Link>
          ))}
        </div>

        {/* Language switch */}
        <div className="mt-10 text-center">
          <Link
            href="/language"
            className="text-sm text-signal hover:underline"
          >
            🌐 {t.chooseLanguage}
          </Link>
        </div>

      </div>
    </main>
  );
}