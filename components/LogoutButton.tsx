"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton({ redirectTo = "/" }: { redirectTo?: string }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <button onClick={handleLogout} className="mono text-xs text-mist hover:text-paper transition">
      Log out
    </button>
  );
}
