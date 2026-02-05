import { Router } from "express";
import {
  getPosts,
  getPostById,
  postPosts,
  toggleLike,
  putPost,
  deletePost
} from "../controllers/posts.controller.js"

const router = new Router();

router.get("/", getPosts);
router.get("/:id", getPostById);
router.post("/", postPosts);
router.post("/:postId/like", toggleLike);
router.put("/:id/edit", putPost);
router.delete("/:id/delete", deletePost);

export default router;
