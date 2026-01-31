import { getUser } from "../services/auth.services.js";

function checkLogin(req, res, next) {
  const token = req.cookies?.inkwell_auth_cookie;
  if (!token) {
    return res.json({"message": "login first"});
  }

  const user = getUser(token);
  if (!user) {
    return res.json({"message": "invalid token"});
  }

  req.user = user;
  next();
}

export default checkLogin;