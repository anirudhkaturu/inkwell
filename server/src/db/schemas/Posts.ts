import { sql, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./Users.js";

export const postsTable = pgTable("posts", {
  id: uuid("id").primaryKey().default(sql`uuidv7()`),
  content: varchar({ length: 500 }).notNull(),

  // linking the post to user and deleting the post upon user delete
  userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" })
});

export type IPost = InferSelectModel<typeof postsTable>;
export type NewPost = InferInsertModel<typeof postsTable>;
