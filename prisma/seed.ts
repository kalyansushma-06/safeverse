// prisma/seed.ts
//
// Creates the minimum rows needed for the app to actually save data:
// one Organization, one Site, one Worker (id "demo-worker" — matches the
// hardcoded id used in app/mission/[missionId]/page.tsx until auth exists),
// and one Mission row per entry in lib/scenarios.ts so foreign keys resolve.
//
// Run with: npx prisma db seed
// (or directly: npx tsx prisma/seed.ts)

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { MISSIONS } from "../lib/scenarios";

const db = new PrismaClient();

// Demo credentials — printed at the end of the script, and documented in
// SETUP_GUIDE.md. Change these before using this seed anywhere but a demo.
const DEMO_WORKER_PASSWORD = "worker123";
const DEMO_ADMIN_PASSWORD = "admin123";

async function main() {
  const org = await db.organization.upsert({
    where: { id: "demo-org" },
    update: {},
    create: { id: "demo-org", name: "Demo Steel Works" }
  });

  const site = await db.site.upsert({
    where: { id: "demo-site" },
    update: {},
    create: { id: "demo-site", name: "Site A", organizationId: org.id }
  });

  const workerPasswordHash = await bcrypt.hash(DEMO_WORKER_PASSWORD, 10);
  await db.worker.upsert({
    where: { id: "demo-worker" },
    update: { passwordHash: workerPasswordHash },
    create: {
      id: "demo-worker",
      name: "Demo Worker",
      employeeCode: "DEMO-001",
      passwordHash: workerPasswordHash,
      role: "WORKER",
      siteId: site.id
    }
  });

  const adminPasswordHash = await bcrypt.hash(DEMO_ADMIN_PASSWORD, 10);
  await db.worker.upsert({
    where: { id: "demo-admin" },
    update: { passwordHash: adminPasswordHash },
    create: {
      id: "demo-admin",
      name: "Site Admin",
      employeeCode: "ADMIN-001",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      siteId: site.id
    }
  });

  for (const mission of MISSIONS) {
    await db.mission.upsert({
      where: { id: mission.id },
      update: { hazard: mission.hazard, title: mission.title, level: mission.level },
      create: {
        id: mission.id,
        hazard: mission.hazard,
        title: mission.title,
        level: mission.level
      }
    });
  }

  console.log("Seed complete:", MISSIONS.length, "missions +");
  console.log("  Worker login  -> code: DEMO-001   password:", DEMO_WORKER_PASSWORD);
  console.log("  Admin login   -> code: ADMIN-001  password:", DEMO_ADMIN_PASSWORD);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
