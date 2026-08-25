import { queryDb } from "@livestore/livestore";

import { tables } from "./schema";

/** All saved resumes, most recently updated first. */
export const resumes$ = queryDb(tables.resumes.select(), {
  label: "resumes",
  map: (rows) => [...rows].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
});

/** Session UI state (currently edited resume). */
export const uiState$ = queryDb(tables.uiState.get(), { label: "uiState" });
