import { type Request, type Response } from "express";
import { User } from "../models/User.js";
import { type IUser } from "../types/user.js";

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
      { username },
      { new: true },
    );

    if(!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Username saved",
      user: updatedUser,
    });

  } catch(err) {
    console.log(err);
    return res.status(500).json({
      message: "Server error",
    });
  }
}

export async function putBio(
  req: Request<{}, {}, { bio: string }> & { user?: IUser }, 
  res: Response
) {
  try {

    if(!req.user) {
      return res.json({
        message: "User Not Authorized"
      });
    }

    const { bio } = req.body;
    if(!bio) {
      return res.json({
        message: "Invalid Input"
      });
    }

    if(bio.length <= 1 && bio.length >= 150) {
      return res.json({
        message: "Bio not of appropriate length"
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { bio },
      { new: true }
    );

    if(!updatedUser) {
      return res.json({
        message: "Bio Update Failed"
      });
    }

    return res.json({
      message: "Bio Updated Successfully"
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server error",
    });
  }
}
