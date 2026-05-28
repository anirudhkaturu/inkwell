import { type Request, type Response, type NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { type IUser } from "../types/user.js";

// interface type for jwt
export interface IUserSession {
  id: string;
  username: string | undefined;
  isOnboardingComplete: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUserSession;
    }
  }
}

interface CustomJwtPayload extends JwtPayload {
  id: string;
  username?: string | null;
  isOnboardingComplete: boolean;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.cookies.inkwell_auth_token;

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Not authorized, no token provided",
    });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const decoded = jwt.verify(token, secret) as CustomJwtPayload;

    // 2. TypeScript is now 100% happy with this assignment layout
    req.user = {
      id: decoded.id,
      username: decoded.username ?? undefined,
      isOnboardingComplete: decoded.isOnboardingComplete,
    };

    next();
  } catch (error: unknown) {
    res.status(401).json({
      success: false,
      message: "Not authorized, token failed or expired",
    });
  }
};
