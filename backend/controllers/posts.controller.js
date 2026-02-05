import Post from "../models/Post.js";
import Likes from "../models/Likes.js"
import Comments from "../models/Comments.js";
import mongoose from "mongoose";

async function getPosts(req, res) {
  try {
    // pagination 
    const limit = 25;
    const cursor = req.query.c

    const query = cursor ? {_id: {$lt: new mongoose.Types.ObjectId(cursor)}} : {};
    const posts = await Post.find(query)
      .sort({_id: -1})
      .limit(limit + 1)
      .populate("author");

    if (posts.length < 1) {
      return res.json([]);
    }

    const hasNextPage = posts.length > limit;
    if (hasNextPage) {
      posts.pop();
    }

    return res.status(200).json({
      posts: posts,
      nextCursor: hasNextPage ? posts[posts.length - 1]._id : null
    });
  } catch (err) {
    console.log("Error: ", err);
    return res.json({error: err});
  }
}

async function getPostById(req, res) {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.json({"message": "post not found"});
  }

  return res.json(post);
}

async function postPosts(req, res) {
  const author = req.user.id;
  if (!author) {
    return res.json({"message": "invalid user"});
  }

  const { content } = req.body;
  if (content.length < 1 || content.length > 5000) {
    return res.json({"message": "content too long"});
  }

  const newPost = await Post.create({author, content});
  if (!newPost) {
    return res.json({"message": "error creating post"});
  }

  return res.json({
    "message": "post successful", 
    newPost
  });
}

async function putPost(req, res) {
  try {
    const userId = req.user.id;
    const postId = req.params.id
    const { content } = req.body;

    if (!content || content.trim().length < 1 || content.length > 5000) {
      return res.json({message: "invalid content length"});
    } 

    const post = await Post.findById(postId);
    if (!post) {
      return res.json({message: "post does not exist"});
    }

    if (post.author.toString() !== userId) {
      return res.json({message: "you are not the author of this post"});
    }

    post.content = content.trim();
    await post.save();
    return res.json({
      message: "post edited successful",
      post
    });

  } catch (err) {
    console.log("Error: ", err);
    return res.json({error: err});
  }
}

async function deletePost(req, res) {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.json({message: "post does not exist"});
    }

    if (post.author.toString() !== userId) {
      return res.json({message: "you are not the author of this post"});
    }

    const deletedPost = await Post.deleteOne({_id: postId, author: userId});
    if (!deletedPost.deletedCount === 0) {
      return res.json({message: "delete faild, try again later"});
    }
    await Likes.deleteMany({ post: postId });
    await Comments.deleteMany({post: postId});

    return res.json({
      message: "post deleted successfully",
      deletedPost
    });
  } catch (err) {
    console.log("Error: ", err);
    return res.json({error: err});
  }
}

async function toggleLike(req, res) {
  const userId = req.user.id;
  const postId = req.params.postId;

  const isLiked = await Likes.findOne({user: userId, post: postId});
  if (!isLiked || isLiked == null) {
    const newLike = await Likes.create({user: userId, post: postId});
    await Post.updateOne({_id: postId}, {$inc: {likes: 1}});

    return res.json({
      message: "liked",
      newLike
    });
  } else {
    await Likes.deleteOne({user: userId, post: postId});
    await Post.updateOne({_id: postId, likes: { $gt: 0 }}, {$inc: {likes: -1}});

    return res.json({message: "unliked"});
  }
}

async function postComment(req, res) {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    const { content } = req.body;
    if (!content || content.trim().length < 1 || content.length > 300) {
      return res.json({message: "invalid comment length"});
    }

    const newComment = await Comments.create({post: postId, user: userId, content: content});
    if (!newComment) {
      return res.json({message: "comment post unsuccessful"});
    }

    return res.json({
      message: "comment posted successfully",
      newComment
    });

  } catch (err) {
    console.log("Error: ", err);
    return res.json({error: err});
  }
}

export {
  getPosts,
  getPostById,
  postPosts,
  toggleLike,
  putPost,
  deletePost,
  postComment
}