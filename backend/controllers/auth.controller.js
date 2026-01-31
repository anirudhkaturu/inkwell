import User from "../models/User.js"
import { setUser } from "../services/auth.services.js";

async function postLogin(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ "message": "invalid input" });
  }

  const user = await User.findOne({email}).select("+password");
  if (!user) {
    return res.json({ "message": "user not found"});
  }

  const isMatch = await user.comparePassword(password);
  if (isMatch === false) {
    return res.json({ "message": "wrong password" }); 
  }

  const token = setUser(user);
  res.cookie("inkwell_auth_cookie", token);
  return res.json({ "message": "successful login" });
}

async function postSignup(req, res) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.json({ "message": "invalid input" });
  }
  
  const newUser = await User.create({ username, email, password});
  return res.json(newUser);
}

function postLogout(req, res) {
  res.clearCookie("inkwell_auth_cookie");
  return res.json({"message": "logged out"});
}

export {
  postLogin, 
  postSignup,
  postLogout
}
