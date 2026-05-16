import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  postLogin,
  postSignup,
  getMe
} from "../controllers/auth.controller.js"

const router = Router();

router.post("/login", postLogin);
router.post("/signup", postSignup);
router.get("/me", protect, getMe);

export default router;