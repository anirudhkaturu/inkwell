import { Router } from "express";
import {
  putUsername,
  putBio
} from "../controllers/onboarding.controller.js"
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.put("/username", protect, putBio);
router.put("/bio", protect, putUsername);

export default router;
