import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { integer, PgBoolean, pgTable, varchar, boolean, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 24 }).unique(),
  phone: varchar({ length: 10 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  bio: varchar({ length: 150 }).default(""),
  profilePicture: varchar().default(""), 
  onboardingDone: boolean().default(false).notNull(),

  // timestamp for account creation
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// for selecting user from db
export type IUser = InferSelectModel<typeof usersTable>;

// for inserting into db, will ignore db generated fields like id and createdAt
export type NewUser = InferInsertModel<typeof usersTable>;
