"use client";

// Copyright (C) 2026 Ziyu Gu
// Licensed under the GNU GPLv3. See LICENSE and NOTICE.

import { useState } from "react";
import { boardFontCss, boardFontOptions } from "@/lib/board-fonts";

type FontStyleControlsProps = {
  titleFont: string;
  descriptionFont: string;
  entryFont: string;
  titleSample: string;
  descriptionSample: string;
  entryNameSample: string;
  entryValueSample: number;
};

export function FontStyleControls({
  titleFont,
  descriptionFont,
  entryFont,
  titleSample,
  descriptionSample,
  entryNameSample,
  entryValueSample
}: FontStyleControlsProps) {
  const [selectedTitleFont, setSelectedTitleFont] = useState(titleFont);
  const [selectedDescriptionFont, setSelectedDescriptionFont] = useState(descriptionFont);
  const [selectedEntryFont, setSelectedEntryFont] = useState(entryFont);

  return (
    <>
      <div className="form-grid">
        <label>
          Title font
          <select name="titleFont" value={selectedTitleFont} onChange={(event) => setSelectedTitleFont(event.target.value)}>
            {boardFontOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <label>
          Description font
          <select
            name="descriptionFont"
            value={selectedDescriptionFont}
            onChange={(event) => setSelectedDescriptionFont(event.target.value)}
          >
            {boardFontOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Entry row font
        <select name="entryFont" value={selectedEntryFont} onChange={(event) => setSelectedEntryFont(event.target.value)}>
          {boardFontOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>
      <div className="font-preview-grid" aria-label="Font previews">
        <div className="font-preview-card">
          <span>Title</span>
          <strong style={{ fontFamily: boardFontCss(selectedTitleFont) }}>{titleSample}</strong>
        </div>
        <div className="font-preview-card">
          <span>Description</span>
          <p style={{ fontFamily: boardFontCss(selectedDescriptionFont) }}>{descriptionSample}</p>
        </div>
        <div className="font-preview-card">
          <span>Entry row</span>
          <div className="font-preview-entry" style={{ fontFamily: boardFontCss(selectedEntryFont) }}>
            <b>1</b>
            <strong>{entryNameSample}</strong>
            <em>{entryValueSample.toLocaleString()}</em>
          </div>
        </div>
      </div>
    </>
  );
}
