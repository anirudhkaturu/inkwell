import { response, type Request, type Response } from "express"
import { User } from "../models/User.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function postLogin(req: Request, res: Response) {
  try {

    const { phone, password } = req.body;
    if(!phone || !password) {
      return res.status(400).json({ message: "Enter Complete Details" });
    }

    const user = await User.findOne({ phone }).select("+password");
    if(!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // create token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        isProfileComplete: user.isProfileComplete, // for onboarding process
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      },
    );

    return res.status(200).cookie(
      "inkwell_auth_token",
      token,
      {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
      },
    ).json({
      message: "Logged in Successfully"
    });

  } catch (err) {
    return res.status(500).json({
      message: "Server Error",
    });
  }
}

export async function postSignup(req: Request, res: Response) {
  try {

    const { phone, password } = req.body;
    if(!phone || !password) {
      return res.status(400).json({ message: "Enter Complete Details" });
    }

    const phoneExists = await User.findOne({ phone });
    if(phoneExists) {
      return res.status(409).json({ message: "Account with that number already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await User.create({
      phone, 
      password: hashedPassword
    });

    // generate token
    const token = jwt.sign(
    {
      id: createdUser._id,
      username: createdUser.username,
      isProfileCompleted: createdUser.isProfileComplete
    }, 
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    });
    
    return res.status(201).cookie(
      "inkwell_auth_token",
      token,
      {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
      },
    ).json(
    { message: "Account Created Successfully" });

  } catch (err) {
    return res.status(500).json({
      message: "Server Error",
    });
  }
}

export async function getMe(req: Request, res: Response) {
  
  if(!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not Authroized"
    });
  }

  return res.status(200).json({
    success: true,
    user: req.user
  });
}
