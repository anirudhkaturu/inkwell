import { Router } from "express";
import {
  putUsername
} from "../controllers/onboarding.controller.js"
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.put("/username", protect, putUsername);

export default router;
