// Copyright (C) 2026 Ziyu Gu
// Licensed under the GNU GPLv3. See LICENSE and NOTICE.

export const boardFontOptions = [
  { value: "system", label: "System", css: "Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif" },
  { value: "roboto", label: "Roboto", css: "Roboto, Arial, Helvetica, sans-serif" },
  { value: "openSans", label: "Open Sans", css: "\"Open Sans\", Arial, Helvetica, sans-serif" },
  { value: "lato", label: "Lato", css: "Lato, Arial, Helvetica, sans-serif" },
  { value: "montserrat", label: "Montserrat", css: "Montserrat, Arial, Helvetica, sans-serif" },
  { value: "robotoMono", label: "Roboto Mono", css: "\"Roboto Mono\", \"Courier New\", ui-monospace, SFMono-Regular, monospace" },
  { value: "comfortaa", label: "Comfortaa", css: "Comfortaa, \"Trebuchet MS\", ui-sans-serif, system-ui, sans-serif" },
  { value: "ebGaramond", label: "EB Garamond", css: "\"EB Garamond\", Garamond, Georgia, serif" },
  { value: "merriweather", label: "Merriweather", css: "Merriweather, Georgia, serif" },
  { value: "clean", label: "Clean", css: "Arial, Helvetica, sans-serif" },
  { value: "serif", label: "Serif", css: "Georgia, \"Times New Roman\", serif" },
  { value: "classic", label: "Classic", css: "Garamond, Baskerville, \"Times New Roman\", serif" },
  { value: "rounded", label: "Rounded", css: "\"Trebuchet MS\", \"Arial Rounded MT Bold\", ui-sans-serif, system-ui, sans-serif" },
  { value: "humanist", label: "Humanist", css: "Verdana, Geneva, sans-serif" },
  { value: "editorial", label: "Editorial", css: "Didot, Bodoni 72, Georgia, serif" },
  { value: "mono", label: "Mono", css: "\"Courier New\", ui-monospace, SFMono-Regular, monospace" },
  { value: "compact", label: "Compact", css: "\"Arial Narrow\", \"Avenir Next Condensed\", sans-serif" },
  { value: "display", label: "Display", css: "Impact, Haettenschweiler, \"Arial Narrow Bold\", sans-serif" }
] as const;

export function boardFontCss(value: string) {
  return boardFontOptions.find((option) => option.value === value)?.css ?? boardFontOptions[0].css;
}
