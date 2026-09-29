"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getMissionById, MissionChoice } from "@/lib/scenarios";
import { getLocalizedMission } from "@/lib/scenarioTranslations";
import { Language } from "@/lib/i18n";

import { scoreMissionAttempt, StepAttempt } from "@/lib/scoring";
import { pressureNote } from "@/lib/competency";

import ARScene from "@/components/ARScene";
import FailureModal from "@/components/FailureModal";

export default function MissionRunnerPage() {
  const { missionId } = useParams<{ missionId: string }>();
  const router = useRouter();

  /*
   * Original mission.
   * We keep this as the source of scoring IDs and safety logic.
   */
  const baseMission = useMemo(
    () => getMissionById(missionId),
    [missionId]
  );

  /*
   * Selected language
   */
  const [language, setLanguage] = useState<Language>("en");

  /*
   * Load selected language.
   * localStorage is checked first, then cookie as fallback.
   */
  useEffect(() => {
    const saved = localStorage.getItem("sv_lang");

    if (
      saved === "en" ||
      saved === "hi" ||
      saved === "sat"
    ) {
      setLanguage(saved as Language);
      return;
    }

    const match = document.cookie.match(
      /(?:^|;\s*)sv_lang=([^;]+)/
    );

    if (
      match &&
      (match[1] === "en" ||
        match[1] === "hi" ||
        match[1] === "sat")
    ) {
      setLanguage(match[1] as Language);
    }
  }, []);

  /*
   * Localized mission.
   *
   * Mission IDs, choice IDs, scoring and AR IDs remain unchanged.
   * Only displayed text is translated.
   */
  const mission = useMemo(() => {
    if (!baseMission) return undefined;

    return getLocalizedMission(
      baseMission,
      language
    );
  }, [baseMission, language]);

  /*
   * Mission runner UI translations
   */
  const pageText = {
    en: {
      step: "Step",
      missionNotFound: "Mission not found.",
      noDecision: "No decision made",
      timeExpired: "Time expired.",
      timeoutExplanation:
        "No decision was made before the window closed. In a real emergency, hesitation carries the same risk as an unsafe choice."
    },

    hi: {
      step: "चरण",
      missionNotFound: "मिशन नहीं मिला।",
      noDecision: "कोई निर्णय नहीं लिया गया",
      timeExpired: "समय समाप्त।",
      timeoutExplanation:
        "समय समाप्त होने से पहले कोई निर्णय नहीं लिया गया। वास्तविक आपातकाल में देरी करना भी असुरक्षित विकल्प जितना जोखिमपूर्ण हो सकता है।"
    },

    sat: {
      step: "ᱫᱷᱟᱯ",
      missionNotFound:
        "ᱢᱤᱥᱚᱱ ᱵᱟᱝ ᱧᱟᱢᱮᱱᱟ᱾",
      noDecision:
        "ᱡᱟᱦᱟᱱ ᱵᱟᱝ ᱵᱟᱪᱷᱟᱣ ᱦᱩᱭᱮᱱᱟ",
      timeExpired:
        "ᱚᱠᱛᱚ ᱪᱟᱵᱟ ᱮᱱᱟ᱾",
      timeoutExplanation:
        "ᱚᱠᱛᱚ ᱪᱟᱵᱟ ᱦᱚᱸ ᱛᱮ ᱡᱟᱦᱟᱱ ᱵᱟᱪᱷᱟᱣ ᱵᱟᱝ ᱦᱩᱭᱮᱱᱟ᱾ ᱥᱟᱞᱟᱢᱟᱹᱛ ᱟᱯᱟᱛᱠᱟᱞ ᱨᱮ ᱫᱮᱨᱤ ᱫᱟᱹᱨᱠᱟᱨ ᱠᱟᱛᱷᱟ ᱢᱮᱱᱟ᱾"
    }
  };

  const text = pageText[language];

  /*
   * Mission state
   */
  const [stepIndex, setStepIndex] = useState(0);

  const [secondsLeft, setSecondsLeft] =
    useState<number | null>(null);

  const [stepStartedAt, setStepStartedAt] =
    useState<number>(Date.now());

  const [attemptLog, setAttemptLog] =
    useState<StepAttempt[]>([]);

  const [pendingChoice, setPendingChoice] =
    useState<MissionChoice | null>(null);

  const [note, setNote] =
    useState<string>("");

  const [workerId, setWorkerId] =
    useState<string>("demo-worker");

  const missionStartedAt = useRef(
    new Date().toISOString()
  );

  /*
   * Get logged-in worker
   */
  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.session?.workerId) {
          setWorkerId(
            data.session.workerId
          );
        }
      })
      .catch(() => {
        // Keep demo-worker fallback.
      });
  }, []);

  /*
   * Current step
   */
  const step = mission?.steps[stepIndex];

  /*
   * Timer
   */
  useEffect(() => {
    if (!step?.timeLimitSeconds) {
      setSecondsLeft(null);
      return;
    }

    setSecondsLeft(
      step.timeLimitSeconds
    );

    setStepStartedAt(Date.now());

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === null) {
          return null;
        }

        if (prev <= 1) {
          clearInterval(interval);
          handleTimeout();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () =>
      clearInterval(interval);

    // handleTimeout intentionally uses current step.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  /*
   * Handle timeout
   */
  function handleTimeout() {
    if (!step) return;

    logStep({
      stepId: step.id,
      choiceId: "TIMEOUT",
      isCorrect: false,
      timeTakenSeconds:
        step.timeLimitSeconds ?? 0,
      timeLimitSeconds:
        step.timeLimitSeconds
    });

    setPendingChoice({
      id: "TIMEOUT",
      label: text.noDecision,
      isCorrect: false,
      points: -15,
      feedback: {
        headline: text.timeExpired,
        explanation:
          text.timeoutExplanation
      }
    });
  }

  /*
   * Handle worker choice
   */
  function handleChoiceSelected(
    choiceId: string
  ) {
    if (!step) return;

    const choice =
      step.choices.find(
        (c) => c.id === choiceId
      );

    if (!choice) return;

    const timeTaken =
      step.timeLimitSeconds
        ? step.timeLimitSeconds -
          (secondsLeft ??
            step.timeLimitSeconds)
        : Math.round(
            (Date.now() -
              stepStartedAt) /
              1000
          );

    setNote(
      pressureNote(
        timeTaken,
        step.timeLimitSeconds,
        choice.isCorrect
      )
    );

    logStep({
      stepId: step.id,
      choiceId: choice.id,
      isCorrect: choice.isCorrect,
      timeTakenSeconds: timeTaken,
      timeLimitSeconds:
        step.timeLimitSeconds
    });

    /*
     * Correct choice → continue
     */
    if (choice.isCorrect) {
      advance();
    } else {
      /*
       * Wrong choice → show feedback modal
       */
      setPendingChoice(choice);
    }
  }

  /*
   * Save step attempt
   */
  function logStep(
    entry: StepAttempt
  ) {
    setAttemptLog((prev) => [
      ...prev.filter(
        (e) =>
          e.stepId !== entry.stepId
      ),
      entry
    ]);
  }

  /*
   * Save reason selected after wrong answer
   */
  function handleReasonSubmit(
    reasonId: string
  ) {
    setAttemptLog((prev) =>
      prev.map((e) =>
        e.stepId === step?.id
          ? {
              ...e,
              reasonId
            }
          : e
      )
    );
  }

  /*
   * Move to next step
   */
  function advance() {
    setPendingChoice(null);

    if (!mission) return;

    if (
      stepIndex + 1 <
      mission.steps.length
    ) {
      setStepIndex(
        stepIndex + 1
      );
    } else {
      finishMission();
    }
  }

  /*
   * Finish mission and save attempt
   */
  async function finishMission() {
    if (!mission) return;

    const attempt = {
      missionId: mission.id,
      workerId,
      startedAt:
        missionStartedAt.current,
      completedAt:
        new Date().toISOString(),
      steps: attemptLog
    };

    const localResult =
      scoreMissionAttempt(
        attempt
      );

    let serverResult: {
      totalPoints: number;
      maxPoints: number;
      percentCorrect: number;
      certificateId:
        | string
        | null;
    } | null = null;

    try {
      const res = await fetch(
        "/api/attempts",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify(
            attempt
          )
        }
      );

      if (!res.ok) {
        throw new Error(
          await res.text()
        );
      }

      serverResult =
        await res.json();
    } catch (err) {
      console.error(
        "Failed to save attempt:",
        err
      );
    }

    const result =
      serverResult ?? {
        ...localResult,
        certificateId: null
      };

    /*
     * Send score information to summary page
     */
    const query =
      new URLSearchParams({
        points: String(
          result.totalPoints
        ),
        max: String(
          result.maxPoints
        ),
        percent: String(
          result.percentCorrect
        ),
        badge:
          mission.badge.icon +
          " " +
          mission.badge.name,
        certId:
          result.certificateId ??
          "",
        saved: serverResult
          ? "1"
          : "0"
      });

    router.push(
      `/mission/${mission.id}/summary?${query.toString()}`
    );
  }

  /*
   * Mission not found
   */
  if (!mission || !step) {
    return (
      <main className="min-h-screen bg-void text-paper flex items-center justify-center">
        <p className="text-mist">
          {text.missionNotFound}
        </p>
      </main>
    );
  }

  /*
   * Mission UI
   */
  return (
    <main className="min-h-screen bg-void text-paper px-6 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Mission header */}
        <div className="flex items-center justify-between mb-4">
          <p className="mono text-xs text-mist">
            {mission.emoji}{" "}
            {mission.title} ·{" "}
            {text.step}{" "}
            {stepIndex + 1}/
            {mission.steps.length}
          </p>

          {secondsLeft !== null && (
            <p
              className={`mono text-lg font-bold ${
                secondsLeft <= 10
                  ? "text-danger"
                  : "text-signal"
              }`}
            >
              {secondsLeft}s
            </p>
          )}
        </div>

        {/* Question */}
        <h1 className="display text-2xl font-bold mb-6">
          {step.prompt}
        </h1>

        {/* AR Scene */}
        <ARScene
          arSceneId={
            step.arSceneId
          }
          choices={step.choices}
          onChoiceSelected={
            handleChoiceSelected
          }
        />

        {/* Answer choices */}
        <div className="mt-6 space-y-3">
          {step.choices.map(
            (choice) => (
              <button
                key={choice.id}
                onClick={() =>
                  handleChoiceSelected(
                    choice.id
                  )
                }
                className="w-full text-left bg-steel border border-steelLine rounded-panel px-4 py-3 hover:border-signal transition"
              >
                {choice.label}
              </button>
            )
          )}
        </div>

        {/* Pressure feedback */}
        {note && (
          <p className="text-mist text-sm mt-4 mono">
            {note}
          </p>
        )}
      </div>

      {/* Wrong-answer / timeout modal */}
      {pendingChoice && (
        <FailureModal
          choice={pendingChoice}
          reasonOptions={
            step.reasonPrompt
          }
          onReasonSubmit={
            handleReasonSubmit
          }
          onRetry={() =>
            setPendingChoice(null)
          }
          onExplain={() => {
            /*
             * Explanation is already
             * displayed inside FailureModal.
             */
          }}
        />
      )}
    </main>
  );
}