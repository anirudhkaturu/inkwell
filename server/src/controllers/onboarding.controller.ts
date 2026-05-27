import { type Request, type Response } from "express";
import { User } from "../models/User.js";
import { type IUser } from "../types/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function putUsername(
  req: Request<{}, {}, { username: string }> & { user?: IUser }, 
  res: Response
) {
  try {

    const { username } = req.body; 
    if(!username) {
      return res.status(400).json({
        message: "Input Invalid"
      });
    }

    const usernameExists = await User.findOne({ username });
    if(usernameExists) {
      return res.status(409).json({
        available: false,
        message: "Username Already Taken"
      });
    }

    if (!req.user) {
      return res.status(401).json({
        message: "Un-Authenticaed User",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { username, onboardingDone: true },
      { new: true},
    );

    if(!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // redo the token after username is set
    const token = jwt.sign({
      id: updatedUser.id,
      username: updatedUser.username,
      isOnboardingComplete: updatedUser.onboardingDone
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
      user: updatedUser,
    });
    
  } catch(err) {
    console.log(err);
    return res.status(500).json({
      message: "Server error",
    });
  }
}
