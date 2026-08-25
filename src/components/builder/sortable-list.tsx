import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Props the list hands back so callers can render their own drag handle. */
export interface DragHandleProps {
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  style: CSSProperties;
  "aria-hidden": true;
  tabIndex: -1;
}

interface DragMetrics {
  ids: string[];
  /** Layout-pure item tops relative to the list container at drag start. */
  tops: number[];
  heights: number[];
  gap: number;
}

interface DragSession {
  id: string;
  /** Pointer offset from the dragged item's container-relative top at grab time. */
  grabOffset: number;
}

interface SortableListProps<T> {
  items: T[];
  getId: (item: T) => string;
  /** Receives the complete new id order once a drop changes something. */
  onReorder: (orderedIds: string[]) => void;
  renderItem: (item: T, handleProps: DragHandleProps, index: number) => ReactNode;
  label: string;
}

interface VisualState {
  translate: number;
  offsets: Record<string, number>;
}

const NO_VISUAL: VisualState = { translate: 0, offsets: {} };

/** Residual translateY left on an element by a previous interaction. */
function residualTranslateY(element: HTMLElement | null | undefined): number {
  if (!element) return 0;
  const match = /translate3d\(0(?:px)?,\s*(-?[\d.]+)px/.exec(element.style.transform);
  return match ? Number(match[1]) : 0;
}

/**
 * Dependency-free pointer-event sortable list. Works with mouse, touch and pen.
 * While a drag is active, move/up/cancel are tracked with window-level
 * listeners so the gesture survives leaving the handle; sibling displacement
 * animates via transforms. Keyboard users reorder through the explicit move
 * buttons each entry renders.
 */
export function SortableList<T>({ items, getId, onReorder, renderItem, label }: SortableListProps<T>) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef(new Map<string, HTMLElement>());
  const metricsRef = useRef<DragMetrics | null>(null);
  const sessionRef = useRef<DragSession | null>(null);
  const pendingOrderRef = useRef<string[] | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [visual, setVisual] = useState<VisualState>(NO_VISUAL);

  const beginDrag = useCallback(
    (index: number, event: ReactPointerEvent<HTMLElement>) => {
      if (sessionRef.current) return; // A drag is already in progress.
      if (event.pointerType === "mouse" && event.button !== 0) return;
      event.preventDefault();

      const listRect = listRef.current?.getBoundingClientRect() ?? new DOMRect(0, 0, 0, 0);
      const entries = items.map((item) => {
        const element = itemRefs.current.get(getId(item));
        const rect = element ? element.getBoundingClientRect() : new DOMRect(0, listRect.top, 0, 0);
        // Compensate for residual transforms so geometry stays layout-pure.
        const residual = residualTranslateY(element);
        return {
          top: rect.top - residual - listRect.top,
          height: rect.height,
        };
      });
      const gap =
        entries.length > 1
          ? Math.max(0, entries[1].top - entries[0].top - entries[0].height)
          : 0;

      const ids = items.map(getId);
      const draggedElement = itemRefs.current.get(ids[index]);
      const itemTopViewport =
        (draggedElement?.getBoundingClientRect().top ?? listRect.top) -
        residualTranslateY(draggedElement);

      metricsRef.current = { ids, tops: entries.map((entry) => entry.top), heights: entries.map((entry) => entry.height), gap };
      sessionRef.current = { id: ids[index], grabOffset: event.clientY - itemTopViewport };
      pendingOrderRef.current = null;
      setVisual(NO_VISUAL);
      setDragId(ids[index]);
    },
    [items, getId],
  );

  // Window-level tracking keeps the gesture alive wherever the pointer goes.
  useEffect(() => {
    if (dragId === null || !metricsRef.current || !sessionRef.current) return;

    const handleMove = (event: PointerEvent) => {
      const metrics = metricsRef.current;
      const session = sessionRef.current;
      if (!metrics || !session || session.id !== dragId) return;
      const activeIndex = metrics.ids.indexOf(dragId);
      if (activeIndex < 0 || !listRef.current) return;

      event.preventDefault();
      const height = metrics.heights[activeIndex];
      const listTopNow = listRef.current.getBoundingClientRect().top;
      const desiredTop = event.clientY - session.grabOffset - listTopNow;

      const lastIndex = metrics.ids.length - 1;
      const minY = metrics.tops[0];
      const maxY = Math.max(minY, metrics.tops[lastIndex] + metrics.heights[lastIndex] - height);
      const y = Math.min(Math.max(desiredTop, minY), maxY);

      const draggedCenter = y + height / 2;
      const shift = height + metrics.gap;
      const offsets: Record<string, number> = {};
      const nextIds: string[] = [];
      let inserted = false;

      for (let j = 0; j < metrics.ids.length; j += 1) {
        const id = metrics.ids[j];
        if (j === activeIndex) continue;
        const center = metrics.tops[j] + metrics.heights[j] / 2;
        if (!inserted && draggedCenter < center) {
          nextIds.push(dragId);
          inserted = true;
        }
        nextIds.push(id);
        if (j < activeIndex && draggedCenter < center) offsets[id] = shift;
        else if (j > activeIndex && draggedCenter > center) offsets[id] = -shift;
      }
      if (!inserted) nextIds.push(dragId);

      pendingOrderRef.current = nextIds;
      setVisual({ translate: y - metrics.tops[activeIndex], offsets });
    };

    const endDrag = (commit: boolean) => (event: Event) => {
      event.preventDefault();
      const metrics = metricsRef.current;
      const nextIds = pendingOrderRef.current;
      metricsRef.current = null;
      sessionRef.current = null;
      pendingOrderRef.current = null;
      setDragId(null);
      setVisual(NO_VISUAL);
      const changed =
        commit && metrics !== null && nextIds !== null && nextIds.join("\n") !== metrics.ids.join("\n");
      if (changed && nextIds) onReorder(nextIds);
    };

    window.addEventListener("pointermove", handleMove, { passive: false });
    window.addEventListener("pointerup", endDrag(true), { once: true });
    window.addEventListener("pointercancel", endDrag(false), { once: true });
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", endDrag(true));
      window.removeEventListener("pointercancel", endDrag(false));
    };
  }, [dragId, onReorder]);

  function handlePropsFor(index: number): DragHandleProps {
    return {
      onPointerDown: (event) => beginDrag(index, event),
      style: { touchAction: "none" },
      "aria-hidden": true,
      tabIndex: -1,
    };
  }

  return (
    <div ref={listRef} role="list" aria-label={label} className="relative flex flex-col gap-3">
      {items.map((item, index) => {
        const id = getId(item);
        const isDragging = dragId === id;
        const offset = isDragging ? visual.translate : (visual.offsets[id] ?? 0);
        return (
          <div
            key={id}
            role="listitem"
            ref={(element) => {
              if (element) itemRefs.current.set(id, element);
              else itemRefs.current.delete(id);
            }}
            className={cn(
              "relative rounded-xl",
              isDragging ? "z-10 shadow-lg" : "transition-transform duration-150",
            )}
            style={{ transform: `translate3d(0, ${offset}px, 0)` }}
          >
            {renderItem(item, handlePropsFor(index), index)}
          </div>
        );
      })}
    </div>
  );
}
