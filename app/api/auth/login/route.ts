// app/api/auth/login/route.ts
//
// One login endpoint for both roles. Worker and admin accounts are both
// Worker rows (see prisma schema) distinguished by `role`, so both the
// worker login page and the admin login page POST here with the same
// { employeeCode, password } shape — the role on the matched row decides
// where the client should redirect afterward.

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signSession, SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  let body: { employeeCode?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { employeeCode, password } = body;
  if (!employeeCode || !password) {
    return NextResponse.json({ error: "Employee code and password are required" }, { status: 400 });
  }

  const worker = await db.worker.findUnique({ where: { employeeCode } });
  if (!worker) {
    return NextResponse.json({ error: "Invalid employee code or password" }, { status: 401 });
  }

  const validPassword = await bcrypt.compare(password, worker.passwordHash);
  if (!validPassword) {
    return NextResponse.json({ error: "Invalid employee code or password" }, { status: 401 });
  }

  const token = await signSession({
    workerId: worker.id,
    name: worker.name,
    role: worker.role as "WORKER" | "SUPERVISOR" | "ADMIN"
  });

  const res = NextResponse.json({ ok: true, role: worker.role, name: worker.name });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7 // 7 days, matches signSession's expiry
  });
  return res;
}
