"use client";

import { useState } from "react";

export function EmbedCodeBox({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="embed-code-box">
      <textarea readOnly value={code} aria-label="Embed code" />
      <button type="button" onClick={copyCode}>{copied ? "Copied" : "Copy embed code"}</button>
    </div>
  );
}
