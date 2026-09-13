// lib/auth.ts
//
// Minimal session system: one login endpoint, one signed HttpOnly cookie,
// role decides where you land. Workers and admins are both rows in the
// Worker table (see prisma/schema.prisma Role enum) — an "admin" is just a
// Worker with role ADMIN or SUPERVISOR, which keeps one login codepath
// instead of two separate user systems.
//
// Uses `jose` rather than `jsonwebtoken` because jose works in the Edge
// runtime, which is what middleware.ts runs on — jsonwebtoken relies on
// Node's crypto module and will silently break there.

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "sv_session";
const SESSION_TTL = "7d";

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET is not set. Add SESSION_SECRET to your .env file (see .env.example)."
    );
  }
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  workerId: string;
  name: string;
  role: "WORKER" | "SUPERVISOR" | "ADMIN";
  [key: string]: unknown; // required so this satisfies jose's JWTPayload shape
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(getSecretKey());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

/** Server Component / Route Handler helper — reads the session from cookies(). */
export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export function isAdminRole(role: string): boolean {
  return role === "ADMIN" || role === "SUPERVISOR";
}

export { SESSION_COOKIE };
