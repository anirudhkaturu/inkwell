import { Router } from "express";
import multer from "multer";
import {
  getProfile,
  putPfp,
  getLikes,
  putBio
} from "../controllers/profile.controller.js"

const upload = multer({
  dest: "/uploads"
});
const router = new Router();

router.get("/", getProfile);
router.post("/pfp", upload.single("pfp"), putPfp);
router.get("/likes", getLikes);
router.put("/bio", putBio);

export default router;