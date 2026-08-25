import { useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/** A4 width at 96dpi. The sheet renders at this size; small screens scale down. */
export const SHEET_WIDTH_PX = 794;

/**
 * Scales a fixed-width A4 sheet to fit its container while preserving layout
 * height (transform does not affect flow). Sheet height changes re-measure.
 */
export function ScaledSheet({ children }: { children: ReactNode }) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const sheet = sheetRef.current;
    if (!frame || !sheet) return;

    let measuredFrameWidth = -1;
    let measuredSheetHeight = -1;

    const update = () => {
      const frameWidth = frame.clientWidth;
      const sheetHeight = sheet.offsetHeight;
      if (frameWidth === measuredFrameWidth && sheetHeight === measuredSheetHeight) return;
      measuredFrameWidth = frameWidth;
      measuredSheetHeight = sheetHeight;
      setScale(Math.min(1, frameWidth / SHEET_WIDTH_PX));
      frame.style.height = `${Math.ceil(sheetHeight * Math.min(1, frameWidth / SHEET_WIDTH_PX))}px`;
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    observer.observe(sheet);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={frameRef} className="relative overflow-hidden">
      <div
        ref={sheetRef}
        style={{
          width: SHEET_WIDTH_PX,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}
