import User from "../models/User.js"
import { setUser } from "../services/auth.services.js";

async function postLogin(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ "message": "invalid input" });
  }

  const user = await User.findOne({email}).select("+password");
  if (!user) {
    return res.status(404).json({ "message": "user not found"});
  }

  const isMatch = await user.comparePassword(password);
  if (isMatch === false) {
    return res.status(401).json({ "message": "wrong password" }); 
  }

  const token = setUser(user);
  res.cookie("inkwell_auth_cookie", token);
  return res.status(200).json({ "message": "successful login" });
}

async function postSignup(req, res) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ "message": "invalid input" });
  }
  
  const newUser = await User.create({ username, email, password});
  return res.status(201).json(newUser);
}

function postLogout(req, res) {
  res.clearCookie("inkwell_auth_cookie");
  return res.status(200).json({"message": "logged out"});
}

export {
  postLogin, 
  postSignup,
  postLogout
}
