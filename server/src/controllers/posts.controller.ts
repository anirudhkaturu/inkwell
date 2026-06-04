import { type Request, type Response } from "express";
import { db } from "../config/postgres.js";
import { postsTable, usersTable, type IPost } from "../db/schema.js";
import { and, desc, eq, isNull, lt } from "drizzle-orm";

export async function createPost(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Un-Authenticated User",
      });
    }

    const { content, parentId } = req.body as {
      content: string;
      parentId?: string;
    };

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Post content cannot be empty",
      });
    }

    const trimmedContent = content.trim();
    if (trimmedContent.length < 1 || trimmedContent.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Content must be between 1 and 500 characters",
      });
    }

    // if its a reply, verify the parent post exists
    if (parentId) {
      const parentCheck = await db
        .select({ id: postsTable.id })
        .from(postsTable)
        .where(eq(postsTable.id, parentId))
        .limit(1);

      if (parentCheck.length === 0) {
        return res.status(404).json({
          success: false,
          message: "The post you are trying to reply to does not exist",
        });
      }
    }

    const insertedPostArray = await db
      .insert(postsTable)
      .values({
        content: trimmedContent,
        userId: req.user.id,
        parentId: parentId || null,
      })
      .returning();

    const newPost = insertedPostArray[0];

    if (!newPost) {
      return res.status(500).json({
        success: false,
        message: "Failed to create post",
      });
    }

    const postWithUserArray = await db
      .select({
        id: postsTable.id,
        content: postsTable.content,
        parentId: postsTable.parentId,
        userId: postsTable.userId,
        user: {
          id: usersTable.id,
          username: usersTable.username,
          // later add pfp
        },
      })
      .from(postsTable)
      .innerJoin(usersTable, eq(postsTable.userId, usersTable.id))
      .where(eq(postsTable.id, newPost.id))
      .limit(1);

    return res.status(201).json({
      success: true,
      message: parentId
        ? "Reply posted successfully"
        : "Tweet posted successfully",
      post: postWithUserArray[0],
    });
  } catch (err) {
    console.error("Error in createPost:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function getFeed(req: Request, res: Response) {
  try {

    // extract the data from the req body
    const { cursor, limit } = req.body as {
      cursor?: string;
      limit?: number;
    };

    const PAGE_LIMIT = limit ? Number(limit) : 10;

    // 2. Build the condition
    // We only want top-level posts (parentId is null)
    // If a cursor is provided, we only want posts created BEFORE that ID
    const dynamicConditions = cursor
      ? and(isNull(postsTable.parentId), lt(postsTable.id, cursor))
      : isNull(postsTable.parentId);

    // 3. Execute Query
    // We fetch limit + 1 to check if there is a next page
    const postsWithUser = await db
      .select({
        id: postsTable.id,
        content: postsTable.content,
        userId: postsTable.userId,
        user: {
          id: usersTable.id,
          username: usersTable.username,
        },
      })
      .from(postsTable)
      .innerJoin(usersTable, eq(postsTable.userId, usersTable.id))
      .where(dynamicConditions)
      .orderBy(desc(postsTable.id))
      .limit(PAGE_LIMIT + 1);

    // 4. Handle Pagination Metadata
    let nextCursor: string | null = null;

    if (postsWithUser.length > PAGE_LIMIT) {
      // Remove the extra item used for the "hasMore" check
      const lastItem = postsWithUser.pop();
      // The popped item's ID becomes the cursor for the next request
      nextCursor = lastItem!.id;
    }

    // 5. Return JSON response
    return res.status(200).json({
      success: true,
      data: postsWithUser,
      nextCursor,
    });
  } catch (error) {
    console.error("Error fetching feed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch feed.",
    });
  }
}