import { type Request, type Response, type NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { User } from "../models/User.js"; 
import { type IUser } from "../types/user.js";

// Extend Express Request type to include our user property
declare global {
  namespace Express {
    interface Request {
      user?: IUser; 
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let token: string | undefined;

  // 1. Check for token in the Authorization header
  token = req.cookies.inkwell_auth_token;

  // console.log("Cookies:", req.cookies);
  // console.log("Token:", req.cookies.inkwell_auth_token);

  // 2. If no token, reject
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Not authorized, no token provided",
    });
    return;
  }

  try {
    // 3. Verify the token – JWT_SECRET must be defined
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const decoded = jwt.verify(token, secret) as JwtPayload & { id: string };

    // 4. Find the user by id from the token payload (exclude password)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User belonging to this token no longer exists",
      });
      return;
    }

    // 5. Attach user to the request object
    req.user = user;
    next();
  } catch (error: unknown) {
    // Token expired or invalid
    const message =
      error instanceof Error ? error.message : "Authentication failed";
    res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
      error: message,
    });
  }
};

// Optional role‑based authorization middleware
// export const authorize = (...roles: string[]) => {
//   return (req: Request, res: Response, next: NextFunction): void => {
//     if (!req.user) {
//       res.status(401).json({ message: "Not authenticated" });
//       return;
//     }
//     if (!roles.includes(req.user.role)) {
//       res.status(403).json({
//         message: `Role (${req.user.role}) is not allowed to access this resource`,
//       });
//       return;
//     }
//     next();
//   };
// };
