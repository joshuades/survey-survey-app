import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";
import { timestamps } from "./helpers";

// export const huntersTable = pgTable("hunter", {
//   id: integer().primaryKey().generatedAlwaysAsIdentity(),
//   name: varchar({ length: 255 }).notNull(),
//   email: varchar({ length: 255 }).notNull().unique(),
//   ...timestamps,
// });

export const survey = pgTable("survey", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  questionsCount: integer("questionsCount").notNull().default(0),
  answersCount: integer("answersCount").notNull().default(0),
  status: varchar({ length: 50 }).notNull().default("active"), // inactive, active
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  ...timestamps,
});

export const question = pgTable("question", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  questionText: varchar({ length: 255 }).notNull(),
  answerType: varchar({ length: 50 }).notNull().default("text"), // text, boolean
  index: integer("index").notNull().default(999),
  status: varchar({ length: 50 }).notNull().default("active"), // new, inactive, active
  surveyId: integer("surveyId")
    .notNull()
    .references(() => survey.id, { onDelete: "cascade" }),
  ...timestamps,
});

export const answer = pgTable("answer", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  type: varchar({ length: 50 }).notNull().default("text"), // text, boolean
  answerText: varchar({ length: 255 }),
  answerBoolean: boolean("answerBoolean"),
  questionId: integer("questionId")
    .notNull()
    .references(() => question.id, { onDelete: "cascade" }),
  answererId: integer("answererId")
    .notNull()
    .references(() => answerer.id, { onDelete: "cascade" }),
  created_at: timestamp().defaultNow().notNull(),
});

export const answerer = pgTable("answerer", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 20 }).notNull().default("anonymous"),
  email: varchar({ length: 50 }),
  created_at: timestamp().defaultNow().notNull(),
});

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);
