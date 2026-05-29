import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { db } from "../config/postgres.js";
import { usersTable, type IUser } from "../db/schema.js";
import { eq } from "drizzle-orm";

dotenv.config();

export async function putUsername(req: Request, res: Response) {
  try {

    if (!req.user) {
      return res.status(401).json({
        message: "Un-Authenticaed User",
      });
    }

    const { username }: { username: string } = req.body; 
    if(!username) {
      return res.status(400).json({
        message: "Input Invalid"
      });
    }

    const newUsername = username.trim();
    if (newUsername.length > 1 || newUsername.length > 24) {
      return res.status(400).json({
        success: false,
        message: "Username Must be Within 1 and 24 characters",
      });
    }

    const usernameRegEx: RegExp = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegEx.test(newUsername)) {
      return res.status(400).json({
        success: false,
        message: "Username can only contain letters, numbers, and underscores",
      });
    }

    const usernameExistsArray: IUser[] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, newUsername))
      .limit(1);
    
    const usernameExists: IUser | undefined = usernameExistsArray[0]; 
    if(usernameExists) {
      return res.status(409).json({
        available: false,
        message: "Username Already Taken"
      });
    }

    const updatedUserArray: IUser[] = await db
      .update(usersTable)
      .set({
        username: newUsername,
        onboarding: true,
      })
      .where(eq(usersTable.id, req.user.id))
      .returning();

    const updatedUser: IUser | undefined = updatedUserArray[0];   

    if(!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // redo the token after username is set
    const token = jwt.sign({
      id: updatedUser.id,
      username: updatedUser.username,
      onboarding: updatedUser.onboarding
    }, process.env.JWT_SECRET as string, {
      expiresIn: "7d"
    });

    return res
    .status(200)
    .cookie("inkwell_auth_token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    })
    .json({
      success: true,
      message: "Username saved and Session Updated",
    });
    
  } catch(err) {
    console.log(err);
    return res.status(500).json({
      message: "Server error",
    });
  }
}
