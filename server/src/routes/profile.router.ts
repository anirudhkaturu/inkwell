import { Router } from "express";
import {
  getProfile,
  putBio,
  putUsername
} from "../controllers/profile.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protect, getProfile);
router.put("/bio", protect, putBio);
router.put("/username", protect, putUsername);

export default router;