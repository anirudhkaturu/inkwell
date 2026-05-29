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

export async function putUsername(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Un-Authenticaed User",
      });
    }

    const { username }: { username: string } = req.body;
    if (!username) {
      return res.status(400).json({
        message: "invalid input",
      });
    }

    const newUsername = username.trim();
    if (newUsername.length === 0 || newUsername.length > 24) {
      return res.status(400).json({
        success: false,
        message: "Username Must be Within 1 and 24 characters",
      });
    }

    const usersExistsArray: IUser[] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, newUsername))
      .limit(1);
    const userExists: IUser | undefined = usersExistsArray[0];

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "That Username is Already Taken, Try Another One",
      });
    }

    const usernameUpdateArray: IUser[] = await db
      .update(usersTable)
      .set({
        username: newUsername,
      })
      .where(eq(usersTable.id, req.user.id))
      .returning();
    const usernameUpdate: IUser | undefined = usernameUpdateArray[0];

    if (!usernameUpdate) {
      return res.status(404).json({
        success: false,
        message: "Username Update Un-Successful",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Username Successfully Updated",
    });
  } catch (error) {
    console.error("Error in putUsername controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
