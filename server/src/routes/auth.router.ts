import { Router } from "express";
import {
  postLogin,
  postSignup
} from "../controllers/auth.controller.js"

const router = Router();

router.post("/login", postLogin);
router.post("/signup", postSignup);

export default router;