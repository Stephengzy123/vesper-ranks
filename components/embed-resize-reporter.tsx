"use client";

// Copyright (C) 2026 Ziyu Gu
// Licensed under the GNU GPLv3. See LICENSE and NOTICE.

import { useEffect } from "react";

export function EmbedResizeReporter({ slug }: { slug: string }) {
  useEffect(() => {
    let frame = 0;

    function reportHeight() {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const height = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.offsetHeight
        );

        window.parent.postMessage(
          {
            type: "vesper-ranks:resize",
            slug,
            height
          },
          "*"
        );
      });
    }

    const observer = new ResizeObserver(reportHeight);
    observer.observe(document.body);
    observer.observe(document.documentElement);
    window.addEventListener("load", reportHeight);
    window.addEventListener("resize", reportHeight);
    reportHeight();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("load", reportHeight);
      window.removeEventListener("resize", reportHeight);
    };
  }, [slug]);

  return null;
}
