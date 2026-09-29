"use client";

import { useState } from "react";

export default function AdminSOSButton() {
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);

  const [message, setMessage] = useState(
    "Emergency alert activated. Please follow safety instructions."
  );

  async function activateSOS() {
    const confirmed = window.confirm(
      "⚠️ ACTIVATE EMERGENCY SOS?\n\n" +
        "This will immediately alert all connected SafeVerse users."
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const response = await fetch("/api/sos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Unable to activate SOS.");
        return;
      }

      setActive(true);

      alert("🚨 Emergency SOS activated.");
    } catch (error) {
      console.error("SOS activation error:", error);
      alert("Unable to activate SOS.");
    } finally {
      setLoading(false);
    }
  }

  async function resolveSOS() {
    const confirmed = window.confirm(
      "Resolve the current emergency alert?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const response = await fetch("/api/sos", {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Unable to resolve SOS.");
        return;
      }

      setActive(false);

      alert("Emergency SOS resolved.");
    } catch (error) {
      console.error("SOS resolve error:", error);
      alert("Unable to resolve SOS.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-panel border border-red-500/40 bg-red-950/20 p-6">
      <p className="text-xs uppercase tracking-widest text-red-400">
        Emergency Control
      </p>

      <h2 className="mt-2 text-2xl font-bold text-white">
        🚨 SafeVerse SOS
      </h2>

      <p className="mt-2 text-sm text-mist">
        Send an emergency alert to SafeVerse users.
      </p>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="mb-4 mt-4 w-full rounded-lg border border-steelLine bg-void p-3 text-sm text-white outline-none"
        rows={3}
        placeholder="Emergency message..."
      />

      {!active ? (
        <button
          onClick={activateSOS}
          disabled={loading}
          className="w-full rounded-lg bg-red-600 px-5 py-4 text-lg font-bold text-white transition hover:bg-red-500 disabled:opacity-50"
        >
          {loading ? "ACTIVATING..." : "🚨 ACTIVATE EMERGENCY SOS"}
        </button>
      ) : (
        <button
          onClick={resolveSOS}
          disabled={loading}
          className="w-full rounded-lg bg-green-600 px-5 py-4 text-lg font-bold text-white transition hover:bg-green-500 disabled:opacity-50"
        >
          {loading ? "RESOLVING..." : "✓ RESOLVE EMERGENCY"}
        </button>
      )}
    </div>
  );
}