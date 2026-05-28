import { type Request, type Response } from "express"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// postgres migration
import { usersTable, type IUser, type NewUser } from "../db/schema.js";
import { db } from "../config/postgres.js";
import { eq } from "drizzle-orm";

dotenv.config();

export async function postLogin(req: Request, res: Response) {
  try {

    const { phone, password } = req.body;
    if(!phone || !password) {
      return res.status(400).json({ message: "Enter Complete Details" });
    }

    const userResult: IUser[] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.phone, phone))
      .limit(1);

    const user: IUser | undefined = userResult[0];

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid phone number or password" });
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
        id: user.id,
        username: user.username || null,
        isOnboardingComplete: user.onboardingDone
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

    const phoneExists: IUser[] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.phone, phone))
      .limit(1);
    
    if(phoneExists.length > 0) {
      return res.status(409).json({ message: "Account with that number already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertData: NewUser = {
      phone,
      password: hashedPassword
    }
    const createdUserArray: IUser[] = await db.insert(usersTable).values(insertData).returning();
    
    // non-null assertion
    const createdUser: IUser = createdUserArray[0]!;

    // generate token
    const token = jwt.sign(
    {
      id: createdUser.id,
      username: null,
      isOnboardingComplete: false
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
      message: "Server Error"
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
