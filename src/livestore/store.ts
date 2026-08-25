import { makePersistedAdapter } from "@livestore/adapter-web";
import LiveStoreSharedWorker from "@livestore/adapter-web/shared-worker?sharedworker";
import { useStore } from "@livestore/react";
import { unstable_batchedUpdates as batchUpdates } from "react-dom";

import LiveStoreWorker from "../livestore.worker.ts?worker";
import { schema } from "./schema";

// SQLite via WebAssembly + OPFS, all inside the worker: resumes are saved to
// the browser's private file storage and survive reloads, fully offline.
const adapter = makePersistedAdapter({
  storage: { type: "opfs" },
  worker: LiveStoreWorker,
  sharedWorker: LiveStoreSharedWorker,
});

export const useAppStore = () =>
  useStore({
    storeId: "resumedev-root",
    schema,
    adapter,
    batchUpdates,
  });
