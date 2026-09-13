// app/api/attempts/route.ts
//
// POST /api/attempts
// Body: MissionAttempt (see lib/scoring.ts) as JSON.
// Writes a MissionAttempt row, and — if the score clears the pass threshold
// — creates a Certificate row with a fresh QR token. Returns the score
// breakdown plus the certificate id (its qrToken) so the client can link
// straight to /certificate/[certId].

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { scoreMissionAttempt, MissionAttempt } from "@/lib/scoring";
import { generateQrToken } from "@/lib/qrcode";

const PASS_THRESHOLD_PERCENT = 70;
const CERTIFICATE_VALID_DAYS = 365;

export async function POST(req: Request) {
  let attempt: MissionAttempt;
  try {
    attempt = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!attempt?.missionId || !attempt?.workerId || !Array.isArray(attempt.steps)) {
    return NextResponse.json({ error: "Missing missionId, workerId, or steps" }, { status: 400 });
  }

  const result = scoreMissionAttempt(attempt);
  const passed = result.percentCorrect >= PASS_THRESHOLD_PERCENT;

  try {
    const savedAttempt = await db.missionAttempt.create({
      data: {
        workerId: attempt.workerId,
        missionId: attempt.missionId,
        startedAt: new Date(attempt.startedAt),
        completedAt: new Date(attempt.completedAt),
        totalPoints: result.totalPoints,
        percentCorrect: result.percentCorrect,
        passed,
        stepResults: attempt.steps as any
      }
    });

    let certificateId: string | null = null;
    if (passed) {
      const qrToken = generateQrToken();
      const cert = await db.certificate.create({
        data: {
          workerId: attempt.workerId,
          missionId: attempt.missionId,
          expiresAt: new Date(Date.now() + CERTIFICATE_VALID_DAYS * 24 * 60 * 60 * 1000),
          qrToken
        }
      });
      certificateId = cert.qrToken;
    }

    return NextResponse.json({
      attemptId: savedAttempt.id,
      totalPoints: result.totalPoints,
      maxPoints: result.maxPoints,
      percentCorrect: result.percentCorrect,
      passed,
      certificateId
    });
  } catch (err) {
    console.error("Failed to save mission attempt:", err);
    return NextResponse.json(
      { error: "Could not save attempt. Is the worker/mission seeded in the database?" },
      { status: 500 }
    );
  }
}
