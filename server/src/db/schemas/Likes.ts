import { pgTable, uuid, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { usersTable } from "./Users.js";
import { postsTable } from "./Posts.js";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const likesTable = pgTable("likes", {
  userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  postId: uuid("post_id").notNull().references(() => postsTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  primaryKey({ columns: [table.userId, table.postId] })
]);

export type ILike = InferSelectModel<typeof likesTable>;
export type NewLike = InferInsertModel<typeof likesTable>;
