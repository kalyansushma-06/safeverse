// lib/scoring.ts
// Turns raw mission attempts into the "Safety Competency Score" breakdown
// instead of a flat X/10, per the design brief.

import { Mission, MissionChoice } from "./scenarios";

export const POINTS = {
  CORRECT_DECISION: 20,
  FAST_RESPONSE_BONUS: 10, // awarded if choice made in first half of time limit
  UNSAFE_ACTION: -15
} as const;

export interface StepAttempt {
  stepId: string;
  choiceId: string;
  isCorrect: boolean;
  timeTakenSeconds: number;
  timeLimitSeconds?: number;
  reasonId?: string; // why the worker picked a wrong choice, if applicable
}

export interface MissionAttempt {
  missionId: string;
  workerId: string;
  startedAt: string; // ISO timestamp
  completedAt: string;
  steps: StepAttempt[];
}

export interface CompetencyBreakdown {
  hazardRecognition: number; // %
  decisionMaking: number; // %
  procedureAccuracy: number; // %
  responseTime: number; // %
  ppeSelection: number; // %
  overall: number; // %
}

export function scoreStep(step: StepAttempt): number {
  let points = step.isCorrect ? POINTS.CORRECT_DECISION : POINTS.UNSAFE_ACTION;
  if (step.isCorrect && step.timeLimitSeconds) {
    if (step.timeTakenSeconds <= step.timeLimitSeconds / 2) {
      points += POINTS.FAST_RESPONSE_BONUS;
    }
  }
  return points;
}

export function scoreMissionAttempt(attempt: MissionAttempt): {
  totalPoints: number;
  maxPoints: number;
  percentCorrect: number;
} {
  const totalPoints = attempt.steps.reduce((sum, s) => sum + scoreStep(s), 0);
  const maxPoints = attempt.steps.length * (POINTS.CORRECT_DECISION + POINTS.FAST_RESPONSE_BONUS);
  const correctCount = attempt.steps.filter((s) => s.isCorrect).length;
  const percentCorrect = Math.round((correctCount / attempt.steps.length) * 100);
  return { totalPoints, maxPoints, percentCorrect };
}

/**
 * Builds the 5-axis Safety Competency Score shown on the worker dashboard.
 * Each axis is derived from a different signal in the attempt history so the
 * breakdown is meaningfully different from a single overall percentage:
 *  - hazardRecognition: correct identification steps (gas zones, hazard spotting)
 *  - decisionMaking: overall correct-choice rate across all mission types
 *  - procedureAccuracy: correct rate specifically on procedure-type missions (LOTO etc.)
 *  - responseTime: how often the fast-response bonus was earned
 *  - ppeSelection: correct rate specifically on PPE-selection steps
 */
export function buildCompetencyBreakdown(
  attempts: MissionAttempt[],
  missionsById: Record<string, Mission>
): CompetencyBreakdown {
  const allSteps: { attemptStep: StepAttempt; hazard: string; stepId: string }[] = [];

  attempts.forEach((attempt) => {
    const mission = missionsById[attempt.missionId];
    if (!mission) return;
    attempt.steps.forEach((s) => {
      allSteps.push({ attemptStep: s, hazard: mission.hazard, stepId: s.stepId });
    });
  });

  if (allSteps.length === 0) {
    return {
      hazardRecognition: 0,
      decisionMaking: 0,
      procedureAccuracy: 0,
      responseTime: 0,
      ppeSelection: 0,
      overall: 0
    };
  }

  const pct = (subset: typeof allSteps) =>
    subset.length === 0 ? 0 : Math.round((subset.filter((s) => s.attemptStep.isCorrect).length / subset.length) * 100);

  const hazardSteps = allSteps.filter((s) => s.stepId.includes("s1")); // first step of each mission = hazard ID
  const procedureSteps = allSteps.filter((s) => s.hazard === "machinery" || s.hazard === "confined_space");
  const ppeSteps = allSteps.filter((s) => s.stepId.includes("ppe") || s.hazard === "ppe");
  const fastCount = allSteps.filter(
    (s) =>
      s.attemptStep.isCorrect &&
      s.attemptStep.timeLimitSeconds &&
      s.attemptStep.timeTakenSeconds <= s.attemptStep.timeLimitSeconds / 2
  ).length;

  const decisionMaking = pct(allSteps);
  const hazardRecognition = pct(hazardSteps.length ? hazardSteps : allSteps);
  const procedureAccuracy = pct(procedureSteps.length ? procedureSteps : allSteps);
  const ppeSelection = pct(ppeSteps.length ? ppeSteps : allSteps);
  const responseTime = Math.round((fastCount / allSteps.length) * 100);

  const overall = Math.round(
    (hazardRecognition + decisionMaking + procedureAccuracy + responseTime + ppeSelection) / 5
  );

  return { hazardRecognition, decisionMaking, procedureAccuracy, responseTime, ppeSelection, overall };
}

export function pickChoice(choices: MissionChoice[], choiceId: string): MissionChoice | undefined {
  return choices.find((c) => c.id === choiceId);
}
