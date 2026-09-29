import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { verifySession, SESSION_COOKIE, isAdminRole } from "@/lib/auth";

async function getSession() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) return null;

  return verifySession(token);
}

// Check whether an emergency is currently active
export async function GET() {
  try {
    const alert = await db.emergencyAlert.findFirst({
      where: { active: true },
      orderBy: { activatedAt: "desc" },
    });

    return NextResponse.json({
      active: !!alert,
      alert: alert || null,
    });
  } catch (error) {
    console.error("SOS status error:", error);

    return NextResponse.json(
      { error: "Unable to check SOS status" },
      { status: 500 }
    );
  }
}

// Activate emergency
export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!isAdminRole(session.role)) {
      return NextResponse.json(
        { error: "Only administrators can activate SOS" },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));

    const message =
      body.message ||
      "Emergency alert activated. Please follow safety instructions.";

    // Resolve any previous active alert
    await db.emergencyAlert.updateMany({
      where: { active: true },
      data: {
        active: false,
        resolvedAt: new Date(),
      },
    });

    // Create new emergency
    const alert = await db.emergencyAlert.create({
      data: {
        message,
        active: true,
      },
    });

    return NextResponse.json({
      success: true,
      alert,
    });
  } catch (error) {
    console.error("SOS activation error:", error);

    return NextResponse.json(
      { error: "Unable to activate SOS" },
      { status: 500 }
    );
  }
}

// Resolve emergency
export async function DELETE() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!isAdminRole(session.role)) {
      return NextResponse.json(
        { error: "Only administrators can resolve SOS" },
        { status: 403 }
      );
    }

    await db.emergencyAlert.updateMany({
      where: { active: true },
      data: {
        active: false,
        resolvedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("SOS resolve error:", error);

    return NextResponse.json(
      { error: "Unable to resolve SOS" },
      { status: 500 }
    );
  }
}
