import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

function setUser(user) {
  const payload = {
    id: user._id,
    email: user.email,
    username: user.username,
    role: user.role
  }
  return jwt.sign(payload, JWT_SECRET);
}

function getUser(token) {
  if (!token) {
    return null
  }

  return jwt.verify(token, JWT_SECRET);
}

export {
  setUser,
  getUser
}