"use client";

import { useEffect, useRef, useState } from "react";

type EmergencyAlert = {
  id: string;
  message: string;
  active: boolean;
  activatedAt: string;
};

export default function SOSAlert() {
  const [alert, setAlert] = useState<EmergencyAlert | null>(null);
  const [visible, setVisible] = useState(false);

  const lastAlertId = useRef<string | null>(null);
  const acknowledgedAlertId = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function checkSOS() {
      try {
        const response = await fetch("/api/sos", {
          cache: "no-store",
        });

        if (!response.ok) return;

        const data = await response.json();

        if (cancelled) return;

        if (data.active && data.alert) {
          const incomingAlert = data.alert;

          setAlert(incomingAlert);

          // New emergency
          if (lastAlertId.current !== incomingAlert.id) {
            lastAlertId.current = incomingAlert.id;
            acknowledgedAlertId.current = null;

            setVisible(true);

            // Vibrate supported phones
            if ("vibrate" in navigator) {
              navigator.vibrate?.([500, 200, 500, 200, 800]);
            }
          } else if (
            acknowledgedAlertId.current !== incomingAlert.id
          ) {
            setVisible(true);
          }
        } else {
          // Emergency resolved
          setAlert(null);
          setVisible(false);
          lastAlertId.current = null;
          acknowledgedAlertId.current = null;
        }
      } catch (error) {
        console.error("SOS polling error:", error);
      }
    }

    checkSOS();

    // Check every 3 seconds
    const interval = setInterval(checkSOS, 3000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  function acknowledgeAlert() {
    if (alert) {
      acknowledgedAlertId.current = alert.id;
    }

    setVisible(false);
  }

  if (!visible || !alert) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[99999] flex min-h-screen items-center justify-center bg-red-950/95 p-6 text-white">
      <div className="w-full max-w-2xl rounded-2xl border-4 border-red-400 bg-red-900 p-8 text-center shadow-2xl">

        <div className="mb-6 text-7xl animate-pulse">
          🚨
        </div>

        <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-red-200">
          Emergency Alert
        </p>

        <h1 className="mb-6 text-4xl font-black md:text-6xl">
          SOS ACTIVE
        </h1>

        <p className="mx-auto mb-6 max-w-xl text-lg leading-relaxed text-red-50 md:text-xl">
          {alert.message}
        </p>

        <div className="mb-8 rounded-lg border border-red-400/40 bg-red-950/50 p-4">
          <p className="text-sm text-red-200">
            Emergency activated at
          </p>

          <p className="mt-1 font-bold">
            {new Date(alert.activatedAt).toLocaleTimeString()}
          </p>
        </div>

        <button
          onClick={acknowledgeAlert}
          className="rounded-xl bg-white px-8 py-4 font-bold text-red-800 transition hover:bg-red-100"
        >
          ACKNOWLEDGE ALERT
        </button>

      </div>
    </div>
  );
}