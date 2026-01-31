import { Router } from "express";
import upload from "../configs/multer.js";
import {
  postLogin, postSignup, postLogout
} from "../controllers/auth.controller.js"

const router = new Router();

router.post("/login", postLogin);
router.post("/signup", upload.single('pfp'), postSignup);
router.post("/logout", postLogout);

export default router;
