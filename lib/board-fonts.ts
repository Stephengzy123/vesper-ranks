// Copyright (C) 2026 Ziyu Gu
// Licensed under the GNU GPLv3. See LICENSE and NOTICE.

export const boardFontOptions = [
  { value: "system", label: "System", css: "Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif" },
  { value: "serif", label: "Serif", css: "Georgia, \"Times New Roman\", serif" },
  { value: "rounded", label: "Rounded", css: "\"Trebuchet MS\", \"Arial Rounded MT Bold\", ui-sans-serif, system-ui, sans-serif" },
  { value: "mono", label: "Mono", css: "\"Courier New\", ui-monospace, SFMono-Regular, monospace" },
  { value: "display", label: "Display", css: "Impact, Haettenschweiler, \"Arial Narrow Bold\", sans-serif" }
] as const;

export function boardFontCss(value: string) {
  return boardFontOptions.find((option) => option.value === value)?.css ?? boardFontOptions[0].css;
}
