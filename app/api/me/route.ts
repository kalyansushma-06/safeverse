// app/api/me/route.ts
//
// Client Components can't call cookies()/getSession() directly (that's a
// Server Component / Route Handler API), so this tiny endpoint exposes the
// current session to client code — used by the mission runner to attach
// the real logged-in workerId to each attempt instead of a hardcoded id.

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  return NextResponse.json({ session });
}
