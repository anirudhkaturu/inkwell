import { Router } from "express";
import {
  getPosts,
  getPostById,
  postPosts
} from "../controllers/posts.controller.js"

const router = new Router();

router.get("/", getPosts);
router.get("/:id", getPostById);
router.post("/", postPosts);

export default router;
