// lib/competency.ts
// This is the feature the brief calls out as genuinely novel: instead of
// grading right/wrong, the app asks WHY a worker made an unsafe choice, then
// surfaces the underlying decision pattern to trainers.

import { MissionAttempt } from "./scoring";

export interface ReasonTally {
  reasonId: string;
  label: string;
  count: number;
}

// Maps raw reason ids (see lib/scenarios.ts reasonPrompt) to a human-readable
// pattern insight for the trainer dashboard.
const REASON_INSIGHTS: Record<string, string> = {
  r1: "Worker tends to choose the shortest route without checking hazard conditions.",
  r2: "Worker relies on visibility rather than verified safety markers.",
  r3: "Worker follows signage correctly — reinforce this as a strength.",
  r4: "Worker prioritizes crowd avoidance over hazard proximity.",
  r5: "Worker is missing hazard cues entirely — recommend a hazard-recognition refresher."
};

export interface WorkerCompetencyProfile {
  workerId: string;
  strengths: string[];
  weaknesses: string[];
  dominantPatterns: string[]; // plain-language behavioral insights, not just stats
  recommendedNextMissionId?: string;
}

/**
 * Tally why-did-you-choose-it reasons across a worker's wrong-answer history.
 * Used to power "Worker tends to choose shortest route without checking
 * hazard conditions" style insights instead of a bare percentage.
 */
export function tallyReasons(attempts: MissionAttempt[]): ReasonTally[] {
  const counts = new Map<string, number>();
  attempts.forEach((attempt) => {
    attempt.steps.forEach((step) => {
      if (!step.isCorrect && step.reasonId) {
        counts.set(step.reasonId, (counts.get(step.reasonId) ?? 0) + 1);
      }
    });
  });

  return Array.from(counts.entries())
    .map(([reasonId, count]) => ({
      reasonId,
      count,
      label: REASON_INSIGHTS[reasonId] ?? reasonId
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Builds a per-worker strengths/weaknesses profile from mission-level
 * pass/fail history, grouped by hazard type. Feeds "Recommended next mission".
 */
export function buildWorkerProfile(
  workerId: string,
  attempts: MissionAttempt[],
  hazardByMission: Record<string, string>,
  missionTitleById: Record<string, string>
): WorkerCompetencyProfile {
  const byHazard = new Map<string, { correct: number; total: number }>();

  attempts.forEach((attempt) => {
    const hazard = hazardByMission[attempt.missionId] ?? "unknown";
    const bucket = byHazard.get(hazard) ?? { correct: 0, total: 0 };
    attempt.steps.forEach((s) => {
      bucket.total += 1;
      if (s.isCorrect) bucket.correct += 1;
    });
    byHazard.set(hazard, bucket);
  });

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  let weakestHazard: string | null = null;
  let weakestRate = 1.1;

  byHazard.forEach((bucket, hazard) => {
    const rate = bucket.total ? bucket.correct / bucket.total : 0;
    if (rate >= 0.8) strengths.push(hazard);
    if (rate < 0.6) weaknesses.push(hazard);
    if (rate < weakestRate) {
      weakestRate = rate;
      weakestHazard = hazard;
    }
  });

  const reasonInsights = tallyReasons(attempts).slice(0, 2).map((r) => r.label);

  return {
    workerId,
    strengths,
    weaknesses,
    dominantPatterns: reasonInsights,
    recommendedNextMissionId: weakestHazard
      ? findNextMissionForHazard(weakestHazard, missionTitleById)
      : undefined
  };
}

function findNextMissionForHazard(hazard: string, missionTitleById: Record<string, string>): string | undefined {
  // Simple heuristic placeholder: in production this queries the mission
  // catalog for the next unattempted level within the weak hazard category.
  const match = Object.keys(missionTitleById).find((id) => id.startsWith(hazard));
  return match;
}

/**
 * Timed-pressure mechanic helper: returns a decision-quality note used on
 * the mission summary screen ("You decided under time pressure and got it
 * right" vs "You had time but still chose unsafely").
 */
export function pressureNote(timeTakenSeconds: number, timeLimitSeconds: number | undefined, isCorrect: boolean): string {
  if (!timeLimitSeconds) return "";
  const usedFraction = timeTakenSeconds / timeLimitSeconds;
  if (isCorrect && usedFraction < 0.5) return "Fast, correct decision under pressure.";
  if (isCorrect && usedFraction >= 0.5) return "Correct, but took most of the available time.";
  if (!isCorrect && usedFraction < 0.5) return "Rushed decision — slow down and check hazard cues first.";
  return "Ran out of time to decide safely — this often happens under real pressure too.";
}
