import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Eye,
  EyeOff,
  GripVertical,
  Trash2,
} from "lucide-react";
import type { ReactNode } from "react";

import type { DragHandleProps } from "./sortable-list";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/react";
import { cn } from "@/lib/utils";

interface EntryShellProps {
  handleProps: DragHandleProps;
  expanded: boolean;
  onToggle: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  /** When provided, renders an eye toggle that excludes the entry from the resume. */
  hidden?: boolean;
  onToggleHidden?: () => void;
  children: ReactNode;
}

/**
 * Collapsible card used for every repeatable resume entry. The grip spreads
 * `handleProps` (pointer-based drag); arrow buttons provide keyboard/mobile
 * reordering as an accessible equivalent.
 */
export function EntryShell({
  handleProps,
  expanded,
  onToggle,
  title,
  subtitle,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onRemove,
  hidden = false,
  onToggleHidden,
  children,
}: EntryShellProps) {
  const { t } = useI18n();
  return (
    <div className="rounded-xl border bg-card text-card-foreground transition-shadow">
      <div className="flex items-center gap-0.5 p-1.5 sm:p-2">
        <button
          type="button"
          {...handleProps}
          className="cursor-grab rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing"
        >
          <GripVertical className="size-4" />
        </button>

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-muted"
        >
          <span className={cn("min-w-0 flex-1", hidden && "opacity-50")}>
            <span className="block truncate text-sm font-medium">{title}</span>
            {subtitle ? (
              <span className="block truncate text-xs text-muted-foreground">{subtitle}</span>
            ) : null}
          </span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform",
              expanded && "rotate-180",
            )}
          />
        </button>

        <div className="flex items-center">
          {onToggleHidden ? (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onToggleHidden}
              aria-label={hidden ? t("aria.showEntry") : t("aria.hideEntry")}
              title={hidden ? t("aria.showEntry") : t("aria.hideEntry")}
              className={cn(hidden && "text-muted-foreground")}
            >
              {hidden ? <EyeOff /> : <Eye />}
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onMoveUp}
            disabled={isFirst}
            aria-label={t("aria.moveUp")}
          >
            <ArrowUp />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onMoveDown}
            disabled={isLast}
            aria-label={t("aria.moveDown")}
          >
            <ArrowDown />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onRemove}
            aria-label={t("aria.remove")}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 />
          </Button>
        </div>
      </div>

      {expanded ? (
        <div className="border-t px-3 py-4 sm:px-4">
          <div className="grid gap-4">{children}</div>
        </div>
      ) : null}
    </div>
  );
}
