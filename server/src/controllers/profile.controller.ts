import { type Request, type Response } from "express";
import { User } from "../models/User.js";
import { type IUser } from "../types/user.js";

export async function getProfile(
  req: Request<{}, {}, { user?: IUser }>, 
  res: Response
) {
  try {

    if(!req.user) {
      return res.status(401).json({
        success: false,
        message: "Un-Authenticaed User",
      });
    }

    return res.status(200).json({
      succes: true,
      user: req.user
    });

  } catch (err) {
    console.error("Error in getProfile:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

export async function putBio(
  req: Request<{}, {}, { bio: string } & { user?: IUser }>, 
  res: Response
) {
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

    const updatedBio = await User.findByIdAndUpdate(
      req.user.id,
      { bio: trimmedBio },
      { new: true }
    );

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
