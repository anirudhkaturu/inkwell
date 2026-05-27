import { Router } from "express";
import {
  getProfile,
  putBio
} from "../controllers/profile.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protect, getProfile);
router.put("/bio", protect, putBio);

export default router;