// lib/scenarios.ts
// Central content model for every AR safety mission.
// Add a new mission by pushing a new object into MISSIONS — nothing else
// in the app needs to change, because ARScene, scoring, and the dashboard
// all read from this shape.

export type HazardType = "fire" | "gas" | "machinery" | "confined_space" | "ppe";

export interface ChoiceReason {
  id: string;
  label: string; // shown to the worker after a wrong choice: "why did you pick this?"
}

export interface MissionChoice {
  id: string;
  label: string;
  isCorrect: boolean;
  points: number; // +20 correct, -15 unsafe, etc. (see lib/scoring.ts for defaults)
  feedback: {
    headline: string; // e.g. "Incorrect decision."
    explanation: string; // why it's wrong / right, in plain language
  };
  // AR anchor this choice corresponds to, so ARScene can highlight the
  // physical/virtual object the worker selected (a door, a valve, an exit sign).
  arObjectId?: string;
}

export interface MissionStep {
  id: string;
  prompt: string; // scenario framing, e.g. "You are inside an industrial area..."
  timeLimitSeconds?: number; // pressure/timed-decision mechanic
  arSceneId: string; // which 3D/AR layout to load for this step
  choices: MissionChoice[];
  // Shown only if the worker picks a wrong choice — captures *why*, not just *that*.
  reasonPrompt?: ChoiceReason[];
}

export interface Mission {
  id: string;
  hazard: HazardType;
  title: string;
  emoji: string;
  level: 1 | 2 | 3;
  description: string;
  steps: MissionStep[];
  badge: {
    id: string;
    name: string;
    icon: string;
  };
}

export const MISSIONS: Mission[] = [
  {
    id: "fire-l1",
    hazard: "fire",
    title: "Fire Emergency",
    emoji: "🔥",
    level: 1,
    description:
      "A fire has broken out on the production floor. You have 90 seconds to reach safety.",
    badge: { id: "badge-fire-1", name: "Fire Responder", icon: "🔥" },
    steps: [
      {
        id: "fire-l1-s1",
        prompt:
          "You are inside an industrial area. An emergency has occurred. Identify the safe exit.",
        timeLimitSeconds: 90,
        arSceneId: "fire_floor_plan_a",
        choices: [
          {
            id: "exit-a",
            label: "Exit A — nearest, but passes near the flame source",
            isCorrect: false,
            points: -15,
            feedback: {
              headline: "Incorrect decision.",
              explanation:
                "This route passes within meters of the fire source. Distance alone does not make an exit safe — always check what lies between you and the door."
            },
            arObjectId: "exit_a_door"
          },
          {
            id: "exit-b",
            label: "Exit B — marked by illuminated safety signage, clear path",
            isCorrect: true,
            points: 20,
            feedback: {
              headline: "Correct decision.",
              explanation:
                "Exit B follows the marked emergency route and avoids the hazard zone entirely. This is the correct choice even though it is slightly farther."
            },
            arObjectId: "exit_b_door"
          },
          {
            id: "exit-c",
            label: "Exit C — through the machinery bay (shortcut)",
            isCorrect: false,
            points: -15,
            feedback: {
              headline: "Incorrect decision.",
              explanation:
                "Cutting through the machinery bay during an emergency risks entanglement and blocks the bay's own evacuation route for other workers."
            },
            arObjectId: "exit_c_door"
          }
        ],
        reasonPrompt: [
          { id: "r1", label: "It was the nearest exit" },
          { id: "r2", label: "It was the most visible exit" },
          { id: "r3", label: "I followed the signboard" },
          { id: "r4", label: "It seemed like a less crowded route" },
          { id: "r5", label: "I didn't notice the hazard" }
        ]
      },
      {
        id: "fire-l1-s2",
        prompt:
          "You have reached the assembly muster point. Alarms are still active. What do you do next?",
        timeLimitSeconds: 30,
        arSceneId: "muster_point",
        choices: [
          {
            id: "report-in",
            label: "Report in at the muster point and wait for headcount",
            isCorrect: true,
            points: 20,
            feedback: {
              headline: "Correct decision.",
              explanation:
                "Reporting in lets supervisors confirm everyone is accounted for. Re-entering the building before an all-clear is one of the leading causes of secondary injuries."
            }
          },
          {
            id: "re-enter",
            label: "Go back in to retrieve your belongings",
            isCorrect: false,
            points: -15,
            feedback: {
              headline: "Incorrect decision.",
              explanation:
                "Re-entering an active hazard zone for personal items is never worth the risk, and it delays headcount for the entire team."
            }
          }
        ]
      }
    ]
  },
  {
    id: "gas-l1",
    hazard: "gas",
    title: "Gas Leak",
    emoji: "☣️",
    level: 1,
    description: "Identify the hazardous zone and select the correct PPE before proceeding.",
    badge: { id: "badge-gas-1", name: "Hazard Spotter", icon: "☣️" },
    steps: [
      {
        id: "gas-l1-s1",
        prompt: "A gas detector is sounding nearby. Identify the hazardous zone on the floor.",
        timeLimitSeconds: 60,
        arSceneId: "gas_zone_map",
        choices: [
          {
            id: "zone-1",
            label: "Zone near the ventilation duct (low airflow corner)",
            isCorrect: true,
            points: 20,
            feedback: {
              headline: "Correct decision.",
              explanation:
                "Gas concentrates in low-airflow pockets. The ventilation dead zone is exactly where readings spike first."
            },
            arObjectId: "zone_vent_corner"
          },
          {
            id: "zone-2",
            label: "Zone near the open loading bay door",
            isCorrect: false,
            points: -15,
            feedback: {
              headline: "Incorrect decision.",
              explanation:
                "Open bay doors ventilate the area, which usually lowers concentration there relative to enclosed corners."
            },
            arObjectId: "zone_bay_door"
          }
        ],
        reasonPrompt: [
          { id: "r1", label: "It smelled stronger there" },
          { id: "r2", label: "The detector was closest to it" },
          { id: "r3", label: "I guessed based on the floor plan" },
          { id: "r4", label: "I didn't notice the hazard" }
        ]
      },
      {
        id: "gas-l1-s2",
        prompt: "Before entering the marked zone to shut the valve, select the required PPE.",
        timeLimitSeconds: 45,
        arSceneId: "ppe_rack",
        choices: [
          {
            id: "ppe-full",
            label: "Full-face respirator + chemical-resistant gloves",
            isCorrect: true,
            points: 20,
            feedback: {
              headline: "Correct decision.",
              explanation:
                "A confirmed gas leak requires full respiratory protection, not a dust mask, before any entry to shut a valve."
            }
          },
          {
            id: "ppe-dust",
            label: "Standard dust mask + work gloves",
            isCorrect: false,
            points: -15,
            feedback: {
              headline: "Incorrect decision.",
              explanation:
                "Dust masks filter particulates only — they provide no protection against the gas itself."
            }
          }
        ]
      }
    ]
  },
  {
    id: "machinery-l1",
    hazard: "machinery",
    title: "Industrial Floor",
    emoji: "🏭",
    level: 1,
    description: "Complete the lockout-tagout safety procedure before servicing equipment.",
    badge: { id: "badge-machinery-1", name: "Procedure Pro", icon: "🏭" },
    steps: [
      {
        id: "machinery-l1-s1",
        prompt:
          "You need to clear a jam on the conveyor. What is the first step before touching the machine?",
        timeLimitSeconds: 45,
        arSceneId: "conveyor_line",
        choices: [
          {
            id: "lockout",
            label: "Lock out and tag out the power source",
            isCorrect: true,
            points: 20,
            feedback: {
              headline: "Correct decision.",
              explanation:
                "Lockout-tagout must happen before any contact with a jammed machine, even for a quick fix."
            }
          },
          {
            id: "quick-fix",
            label: "Reach in quickly while the belt is stopped",
            isCorrect: false,
            points: -15,
            feedback: {
              headline: "Incorrect decision.",
              explanation:
                "A stopped belt is not the same as a de-energized one. Stored energy or an accidental restart can cause severe injury."
            }
          }
        ]
      }
    ]
  }
];

export function getMissionById(id: string): Mission | undefined {
  return MISSIONS.find((m) => m.id === id);
}
