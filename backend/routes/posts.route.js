import { Router } from "express";
import {
  getPosts,
  postPosts
} from "../controllers/posts.controller.js"

const router = new Router();

router.get("/", getPosts);
router.post("/", postPosts);

export default router;
