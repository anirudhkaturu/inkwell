import { pgTable, timestamp, uuid, primaryKey } from "drizzle-orm/pg-core";
import { usersTable } from "./Users.js";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const followsTable = pgTable("follows", {
  followerId: uuid("follower_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  followingId: uuid("following_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  primaryKey({ columns: [table.followerId, table.followingId] })
]);

export type IFollow = InferSelectModel<typeof followsTable>;
export type NewFollow = InferInsertModel<typeof followsTable>;
