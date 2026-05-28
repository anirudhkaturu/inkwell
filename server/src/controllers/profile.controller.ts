import { type Request, type Response } from "express";
import { db } from "../config/postgres.js";
import { usersTable, type IUser } from "../db/schema.js";
import { eq } from "drizzle-orm";

export async function getProfile(req: Request, res: Response) {
  try {

    if(!req.user) {
      return res.status(401).json({
        success: false,
        message: "Un-Authenticaed User",
      });
    }

    const usersArray: IUser[] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, req.user.id))
    .limit(1);

    const tempUser: IUser | undefined = usersArray[0];
    
    if (!tempUser) {
      return res.status(401).json({
        success: false,
        message: "User Not Found"
      });
    }

    const { password, phone, ...safeUser } = tempUser;

    return res.status(200).json({
      success: true,
      user: safeUser
    });

  } catch (err) {
    console.error("Error in getProfile:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

export async function putBio(req: Request, res: Response) {
  try {
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Un-Authenticaed User",
      });
    }

    const { bio } = req.body;
    if (!bio) {
      return res.status(400).json({
        message: "invalid input",
      });
    }

    const trimmedBio = bio.trim();
    if (trimmedBio.length < 1 || trimmedBio.length > 150) {
      return res.status(400).json({
        message: "Bio must be between 1 and 150 characters",
      });
    }

    const updatedBioArray: IUser[] = await db
      .update(usersTable)
      .set({
        bio: trimmedBio
      })
      .where(eq(usersTable.id, req.user.id))
      .returning();

    const updatedBio: IUser | undefined = updatedBioArray[0];

    if (!updatedBio) {
      return res.status(404).json({
        success: false,
        message: "User not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "bio updated successfully",
    })

  } catch (err) {
    console.error("Error in putBio:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
