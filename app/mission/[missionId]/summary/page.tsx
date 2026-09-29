"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";

import { getMissionById } from "@/lib/scenarios";
import { getLocalizedMission } from "@/lib/scenarioTranslations";
import { getTranslations, Language } from "@/lib/i18n";

const PASS_THRESHOLD_PERCENT = 70;

export default function MissionSummaryPage() {
  const { missionId } = useParams<{ missionId: string }>();
  const search = useSearchParams();

  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("sv_lang");

    if (saved === "en" || saved === "hi" || saved === "sat") {
      setLanguage(saved as Language);
      return;
    }

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

  const baseMission = getMissionById(missionId);

  const mission = baseMission
    ? getLocalizedMission(baseMission, language)
    : undefined;

  const t = getTranslations(language);

  const points = Number(search.get("points") ?? 0);
  const max = Number(search.get("max") ?? 1);
  const percent = Number(search.get("percent") ?? 0);
  const badge = search.get("badge") ?? "";
  const certId = search.get("certId") ?? "";
  const saved = search.get("saved") !== "0";
  const passed = percent >= PASS_THRESHOLD_PERCENT;

  const text = {
    en: {
      complete: "complete",
      availablePoints: "available points",
      correct: "correct",
      scoreNotSaved:
        "This score wasn't saved to the database (the save request failed). It won't show up on the dashboard or certificate. Check your dev server terminal for the error.",
      passed: "🏆 Passed",
      notPassed: "❌ Not yet passed",
      badgeEarned: "Badge earned:",
      passRequirement:
        "Score 70% or higher to earn the badge and certificate.",
      viewCertificate: "View Certificate",
      retryMission: "Retry Mission",
      allMissions: "All Missions",
    },

    hi: {
      complete: "पूरा हुआ",
      availablePoints: "उपलब्ध अंक",
      correct: "सही",
      scoreNotSaved:
        "यह स्कोर डेटाबेस में सेव नहीं हुआ (सेव अनुरोध विफल हो गया)। यह डैशबोर्ड या प्रमाणपत्र में दिखाई नहीं देगा। त्रुटि के लिए अपना dev server terminal देखें।",
      passed: "🏆 उत्तीर्ण",
      notPassed: "❌ अभी उत्तीर्ण नहीं",
      badgeEarned: "बैज प्राप्त:",
      passRequirement:
        "बैज और प्रमाणपत्र प्राप्त करने के लिए 70% या उससे अधिक अंक प्राप्त करें।",
      viewCertificate: "प्रमाणपत्र देखें",
      retryMission: "मिशन दोबारा करें",
      allMissions: "सभी मिशन",
    },

    sat: {
      complete: "ᱯᱩᱨᱟᱹᱣ",
      availablePoints: "ᱫᱟᱹᱲᱟᱹ ᱯᱚᱭᱱᱴ",
      correct: "ᱥᱟᱹᱦᱤ",
      scoreNotSaved:
        "ᱱᱚᱣᱟ ᱥᱠᱳᱨ ᱰᱟᱴᱟᱵᱮᱥ ᱨᱮ ᱥᱮᱵᱽ ᱵᱟᱝ ᱦᱩᱭᱮᱱᱟ। ᱱᱚᱣᱟ ᱰᱟᱥᱵᱳᱨᱰ ᱟᱨ ᱥᱟᱹᱴᱤᱯᱷᱤᱠᱮᱴ ᱨᱮ ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ। ᱰᱮᱵᱽ ᱥᱟᱨᱵᱷᱟᱨ ᱴᱟᱹᱨᱢᱤᱱᱟᱞ ᱨᱮ ᱵᱷᱩᱞ ᱧᱮᱞ ᱢᱮᱞᱟᱹ।",
      passed: "🏆 ᱯᱟᱥ",
      notPassed: "❌ ᱱᱚᱝᱠᱟᱹᱱ ᱵᱟᱝ ᱯᱟᱥ",
      badgeEarned: "ᱵᱮᱡ ᱦᱟᱹᱛᱟᱣ:",
      passRequirement:
        "ᱵᱮᱡ ᱟᱨ ᱥᱟᱹᱴᱤᱯᱷᱤᱠᱮᱴ ᱯᱟᱹᱯᱛᱤ ᱞᱟᱹᱜᱤᱫ 70% ᱥᱮ ᱪᱮᱫ ᱟᱹᱲᱤ ᱠᱟᱛᱮ ᱯᱟᱥ ᱢᱮᱱᱟᱜᱼᱟ।",
      viewCertificate: "ᱥᱟᱹᱴᱤᱯᱷᱤᱠᱮᱴ ᱧᱮᱞ ᱢᱮ",
      retryMission: "ᱢᱤᱥᱚᱱ ᱫᱚᱦᱲᱟ ᱢᱮ",
      allMissions: "ᱡᱚᱛᱚ ᱢᱤᱥᱚᱱ",
    },
  }[language];

  return (
    <main className="min-h-screen bg-void text-paper flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">

        <p className="mono text-xs text-mist mb-2">
          {mission?.title ?? "Mission"} {text.complete}
        </p>

        <h1 className="display text-4xl font-bold mb-1">
          {points} pts
        </h1>

        <p className="text-mist mb-8">
          {points} / {max} {text.availablePoints} · {percent}% {text.correct}
        </p>

        {!saved && (
          <p className="text-caution text-sm bg-caution/10 border border-caution/40 rounded-panel p-3 mb-6">
            {text.scoreNotSaved}
          </p>
        )}

        <div
          className={`rounded-panel border p-6 mb-8 ${
            passed
              ? "border-safe bg-safe/10"
              : "border-danger bg-danger/10"
          }`}
        >
          <p className="text-2xl font-bold mb-1">
            {passed ? text.passed : text.notPassed}
          </p>

          {passed ? (
            <p className="text-mist text-sm">
              {text.badgeEarned}{" "}
              <span className="text-paper font-semibold">
                {badge}
              </span>
            </p>
          ) : (
            <p className="text-mist text-sm">
              {text.passRequirement}
            </p>
          )}
        </div>

        <div className="flex gap-3 justify-center">
          {passed && certId ? (
            <Link
              href={`/certificate/${certId}`}
              className="bg-signal text-void font-semibold px-6 py-3 rounded-panel hover:brightness-110 transition"
            >
              {text.viewCertificate}
            </Link>
          ) : (
            <Link
              href={`/mission/${missionId}`}
              className="bg-signal text-void font-semibold px-6 py-3 rounded-panel hover:brightness-110 transition"
            >
              {text.retryMission}
            </Link>
          )}

          <Link
            href="/modules"
            className="border border-steelLine px-6 py-3 rounded-panel text-mist hover:border-paper hover:text-paper transition"
          >
            {text.allMissions}
          </Link>
        </div>
      </div>
    </main>
  );
}