import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

interface SectionCardProps {
  id: string;
  title: string;
  count?: number;
  action?: ReactNode;
  children: ReactNode;
}

/** Bordered card wrapper giving every form section the same chrome. */
export function SectionCard({ id, title, count, action, children }: SectionCardProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24">
      <div className="rounded-xl border bg-card text-card-foreground shadow-xs">
        <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
          <h2 id={`${id}-heading`} className="flex items-center gap-2 text-sm font-semibold">
            {title}
            {typeof count === "number" && count > 0 && (
              <Badge variant="secondary" className="tabular-nums">
                {count}
              </Badge>
            )}
          </h2>
          {action}
        </div>
        <div className="p-3 sm:p-4">{children}</div>
      </div>
    </section>
  );
}
