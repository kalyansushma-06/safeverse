"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMissionById, MissionChoice } from "@/lib/scenarios";
import { scoreMissionAttempt, StepAttempt } from "@/lib/scoring";
import { pressureNote } from "@/lib/competency";
import ARScene from "@/components/ARScene";
import FailureModal from "@/components/FailureModal";

export default function MissionRunnerPage() {
  const { missionId } = useParams<{ missionId: string }>();
  const router = useRouter();
  const mission = useMemo(() => getMissionById(missionId), [missionId]);

  const [stepIndex, setStepIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [stepStartedAt, setStepStartedAt] = useState<number>(Date.now());
  const [attemptLog, setAttemptLog] = useState<StepAttempt[]>([]);
  const [pendingChoice, setPendingChoice] = useState<MissionChoice | null>(null);
  const [note, setNote] = useState<string>("");
  const [workerId, setWorkerId] = useState<string>("demo-worker"); // placeholder until session loads
  const missionStartedAt = useRef(new Date().toISOString());

  // Pull the real logged-in worker id once on mount. Middleware already
  // guarantees a session exists for /mission/* routes, so this should
  // always resolve — the "demo-worker" default above only covers the brief
  // instant before this request completes.
  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.session?.workerId) setWorkerId(data.session.workerId);
      })
      .catch(() => {
        /* stay on the placeholder id; the attempt save will still work against the seeded demo worker */
      });
  }, []);

  const step = mission?.steps[stepIndex];

  // Timer per step — powers the "pressurized decision" mechanic from the brief.
  useEffect(() => {
    if (!step?.timeLimitSeconds) {
      setSecondsLeft(null);
      return;
    }
    setSecondsLeft(step.timeLimitSeconds);
    setStepStartedAt(Date.now());
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  function handleTimeout() {
    if (!step) return;
    logStep({
      stepId: step.id,
      choiceId: "TIMEOUT",
      isCorrect: false,
      timeTakenSeconds: step.timeLimitSeconds ?? 0,
      timeLimitSeconds: step.timeLimitSeconds
    });
    setPendingChoice({
      id: "TIMEOUT",
      label: "No decision made",
      isCorrect: false,
      points: -15,
      feedback: {
        headline: "Time expired.",
        explanation: "No decision was made before the window closed. In a real emergency, hesitation carries the same risk as an unsafe choice."
      }
    });
  }

  function handleChoiceSelected(choiceId: string) {
    if (!step) return;
    const choice = step.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    const timeTaken = step.timeLimitSeconds
      ? step.timeLimitSeconds - (secondsLeft ?? step.timeLimitSeconds)
      : Math.round((Date.now() - stepStartedAt) / 1000);

    setNote(pressureNote(timeTaken, step.timeLimitSeconds, choice.isCorrect));

    logStep({
      stepId: step.id,
      choiceId: choice.id,
      isCorrect: choice.isCorrect,
      timeTakenSeconds: timeTaken,
      timeLimitSeconds: step.timeLimitSeconds
    });

    if (choice.isCorrect) {
      advance();
    } else {
      setPendingChoice(choice);
    }
  }

  function logStep(entry: StepAttempt) {
    setAttemptLog((prev) => [...prev.filter((e) => e.stepId !== entry.stepId), entry]);
  }

  function handleReasonSubmit(reasonId: string) {
    setAttemptLog((prev) =>
      prev.map((e) => (e.stepId === step?.id ? { ...e, reasonId } : e))
    );
  }

  function advance() {
    setPendingChoice(null);
    if (!mission) return;
    if (stepIndex + 1 < mission.steps.length) {
      setStepIndex(stepIndex + 1);
    } else {
      finishMission();
    }
  }

  async function finishMission() {
    if (!mission) return;
    const attempt = {
      missionId: mission.id,
      workerId,
      startedAt: missionStartedAt.current,
      completedAt: new Date().toISOString(),
      steps: attemptLog
    };

    // Client-side score, used as a fallback if the save fails so the worker
    // still sees a result — but the authoritative score comes from the
    // server response below, since that's what actually got persisted.
    const localResult = scoreMissionAttempt(attempt);
    let serverResult: {
      totalPoints: number;
      maxPoints: number;
      percentCorrect: number;
      certificateId: string | null;
    } | null = null;

    try {
      const res = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attempt)
      });
      if (!res.ok) throw new Error(await res.text());
      serverResult = await res.json();
    } catch (err) {
      // Falls through to the local (unsaved) score below — worker still sees
      // a result, but nothing persisted. summary page shows a warning banner
      // when saved=0, and the README §5 troubleshooting table covers causes.
      console.error("Failed to save attempt:", err);
    }

    const result = serverResult ?? { ...localResult, certificateId: null };
    const query = new URLSearchParams({
      points: String(result.totalPoints),
      max: String(result.maxPoints),
      percent: String(result.percentCorrect),
      badge: mission.badge.icon + " " + mission.badge.name,
      certId: result.certificateId ?? "",
      saved: serverResult ? "1" : "0"
    });
    router.push(`/mission/${mission.id}/summary?${query.toString()}`);
  }

  if (!mission || !step) {
    return (
      <main className="min-h-screen bg-void text-paper flex items-center justify-center">
        <p className="text-mist">Mission not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-void text-paper px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <p className="mono text-xs text-mist">
            {mission.emoji} {mission.title} · Step {stepIndex + 1}/{mission.steps.length}
          </p>
          {secondsLeft !== null && (
            <p className={`mono text-lg font-bold ${secondsLeft <= 10 ? "text-danger" : "text-signal"}`}>
              {secondsLeft}s
            </p>
          )}
        </div>

        <h1 className="display text-2xl font-bold mb-6">{step.prompt}</h1>

        <ARScene arSceneId={step.arSceneId} choices={step.choices} onChoiceSelected={handleChoiceSelected} />

        <div className="mt-6 space-y-3">
          {step.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => handleChoiceSelected(choice.id)}
              className="w-full text-left bg-steel border border-steelLine rounded-panel px-4 py-3 hover:border-signal transition"
            >
              {choice.label}
            </button>
          ))}
        </div>

        {note && <p className="text-mist text-sm mt-4 mono">{note}</p>}
      </div>

      {pendingChoice && (
        <FailureModal
          choice={pendingChoice}
          reasonOptions={step.reasonPrompt}
          onReasonSubmit={handleReasonSubmit}
          onRetry={() => setPendingChoice(null)}
          onExplain={() => {
            /* explanation already shown inline in modal */
          }}
        />
      )}
    </main>
  );
}
