"use client";

import { useState } from "react";
import { ChoiceReason, MissionChoice } from "@/lib/scenarios";

export default function FailureModal({
  choice,
  reasonOptions,
  onRetry,
  onExplain,
  onReasonSubmit
}: {
  choice: MissionChoice;
  reasonOptions?: ChoiceReason[];
  onRetry: () => void;
  onExplain: () => void;
  onReasonSubmit?: (reasonId: string) => void;
}) {
  const [reasonPicked, setReasonPicked] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="fixed inset-0 bg-void/90 flex items-center justify-center px-6 z-50">
      <div className="bg-steel border border-danger/50 rounded-panel max-w-md w-full p-6">
        <p className="text-danger font-semibold mono text-sm mb-2">⚠️ {choice.feedback.headline}</p>
        <p className="text-paper mb-5">{choice.feedback.explanation}</p>

        {!showExplanation && reasonOptions && reasonOptions.length > 0 && (
          <div className="mb-6">
            <p className="text-mist text-sm mb-3">What made you choose it?</p>
            <div className="space-y-2">
              {reasonOptions.map((reason) => (
                <button
                  key={reason.id}
                  onClick={() => {
                    setReasonPicked(reason.id);
                    onReasonSubmit?.(reason.id);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-panel border text-sm transition ${
                    reasonPicked === reason.id
                      ? "border-signal bg-signal/10"
                      : "border-steelLine hover:border-mist"
                  }`}
                >
                  {reason.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 bg-signal text-void font-semibold py-3 rounded-panel hover:brightness-110 transition"
          >
            Try Again
          </button>
          <button
            onClick={() => {
              setShowExplanation(true);
              onExplain();
            }}
            className="flex-1 border border-steelLine text-mist py-3 rounded-panel hover:border-paper hover:text-paper transition"
          >
            View Explanation
          </button>
        </div>
      </div>
    </div>
  );
}
