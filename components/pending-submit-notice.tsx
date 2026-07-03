"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

type PendingSubmitNoticeProps = {
  messages: [string, string, string];
};

export function PendingSubmitNotice({ messages }: PendingSubmitNoticeProps) {
  const { pending } = useFormStatus();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!pending) {
      setPhase(0);
      return;
    }

    const slowTimer = window.setTimeout(() => setPhase(1), 5000);
    const almostTimer = window.setTimeout(() => setPhase(2), 10000);

    return () => {
      window.clearTimeout(slowTimer);
      window.clearTimeout(almostTimer);
    };
  }, [pending]);

  if (!pending) return null;

  return (
    <div className="pending-overlay" aria-live="polite" aria-busy="true">
      <div className="pending-toast">
        <span className="pending-spinner" aria-hidden="true" />
        <span key={phase} className="pending-message">{messages[phase]}</span>
      </div>
    </div>
  );
}
