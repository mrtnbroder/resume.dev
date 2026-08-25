/**
 * LiveStore schema: persisted resume documents plus the events that change them.
 *
 * Each resume is one row; its `data` column holds the whole resume document,
 * validated by this Effect Schema mirror of the domain model in
 * `src/lib/resume.ts`. Events carry full document snapshots so materializers
 * stay deterministic replays of the event log.
 */
import { Events, makeSchema, Schema, SessionIdSymbol, State } from "@livestore/livestore";

const PersonalSchema = Schema.Struct({
  fullName: Schema.String,
  headline: Schema.String,
  email: Schema.String,
  phone: Schema.String,
  location: Schema.String,
  website: Schema.String,
  summary: Schema.String,
});

const WorkExperienceSchema = Schema.Struct({
  id: Schema.String,
  company: Schema.String,
  position: Schema.String,
  startDate: Schema.String,
  endDate: Schema.String,
  current: Schema.Boolean,
  description: Schema.String,
});

const EducationEntrySchema = Schema.Struct({
  id: Schema.String,
  school: Schema.String,
  degree: Schema.String,
  field: Schema.String,
  startDate: Schema.String,
  endDate: Schema.String,
});

export const ResumeDataSchema = Schema.Struct({
  personal: PersonalSchema,
  work: Schema.Array(WorkExperienceSchema),
  education: Schema.Array(EducationEntrySchema),
  skills: Schema.Array(Schema.String),
});

export const tables = {
  resumes: State.SQLite.table({
    name: "resumes",
    columns: {
      id: State.SQLite.text({ primaryKey: true }),
      name: State.SQLite.text({ default: "" }),
      data: State.SQLite.json({ schema: ResumeDataSchema }),
      createdAt: State.SQLite.datetime({}),
      updatedAt: State.SQLite.datetime({}),
    },
  }),
  // Which resume this browser is editing. A client document is shared across
  // the tabs of one browser but never leaves the device.
  uiState: State.SQLite.clientDocument({
    name: "uiState",
    schema: Schema.Struct({ activeResumeId: Schema.String }),
    default: { id: SessionIdSymbol, value: { activeResumeId: "" } },
  }),
};

export const events = {
  resumeCreated: Events.synced({
    name: "v1.ResumeCreated",
    schema: Schema.Struct({
      id: Schema.String,
      name: Schema.String,
      data: ResumeDataSchema,
      createdAt: Schema.DateFromString,
    }),
  }),
  resumeSaved: Events.synced({
    name: "v1.ResumeSaved",
    schema: Schema.Struct({
      id: Schema.String,
      data: ResumeDataSchema,
      savedAt: Schema.DateFromString,
    }),
  }),
  resumeRenamed: Events.synced({
    name: "v1.ResumeRenamed",
    schema: Schema.Struct({ id: Schema.String, name: Schema.String }),
  }),
  resumeDeleted: Events.synced({
    name: "v1.ResumeDeleted",
    schema: Schema.Struct({ id: Schema.String }),
  }),
  uiStateSet: tables.uiState.set,
};

const materializers = State.SQLite.materializers(events, {
  "v1.ResumeCreated": ({ id, name, data, createdAt }) =>
    tables.resumes.insert({ id, name, data, createdAt, updatedAt: createdAt }),
  "v1.ResumeSaved": ({ id, data, savedAt }) =>
    tables.resumes.update({ data, updatedAt: savedAt }).where({ id }),
  "v1.ResumeRenamed": ({ id, name }) => tables.resumes.update({ name }).where({ id }),
  "v1.ResumeDeleted": ({ id }) => tables.resumes.delete().where({ id }),
});

const state = State.SQLite.makeState({ tables, materializers });

export const schema = makeSchema({ events, state });
