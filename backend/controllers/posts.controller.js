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
      .populate("author", "username");

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
  try {
    const post = await Post.findById(req.params.id).populate("author", "username");
    if (!post) {
      return res.json({"message": "post not found"});
    }

    return res.json(post);
  } catch (err) {
    console.log("Error: ", err);
    return res.json({error: err});
  }
}

async function putPost(req, res) {
  try {
    const userId = req.user.id;
    const { content } = req.body;
    const postId = req.params.id;

    if (!content || content.trim().length < 1 || content.length > 5000) {
      return res.status(404).json({message: "invalid input"});
    }

    const post = await Post.findById({postId});
    if (!post) {
      return res.json({message: "post not found"});
    }
    if (post.author.toString() !== userId) {
      return res.status(403).json({message: "unauthorized: you do not own this post"});
    }

    post.content = content.trim();
    const updatedPost = await post.save();

    return res.status(200).json({
      message: "post successfully updated",
      post: updatedPost
    });
  } catch (err) {
    console.log("Error: ", err);
    return res.json({message: "server error"});
  }
}

async function postPosts(req, res) {
  try {
    const author = req.user.id;
    const { content } = req.body;
    if (!content || content.trim().length < 1 || content.length > 5000) {
      return res.json({ message: "content too long" });
    }

    const newPost = await Post.create({ author, content });
    if (!newPost) {
      return res.json({ message: "error creating post" });
    }

    return res.json({
      message: "post successful",
      newPost,
    });
  } catch (err) {
    console.log("Error: ", err);
    return res.json({error: err});
  }
}

async function deletePost(req, res) {
  const userId = req.user.id;
  const postId = req.params.id;
  
  // implementing transcation for deleting post,
  // along with associated comments and likes 
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const opts = { session };

    const post = await Post.findById(postId).session(session);
    if (!post) {
      throw new Error("Post does not exit");
    }

    if (post.author.toString() !== userId) {
      throw new Error("You are not the author of this post");
    }
    
    const deletedResult = await Post.deleteOne({_id: postId, author: userId}, opts);
    if (deletedResult.deletedCount === 0) {
      console.log("Post Delete Failed");
      throw new Error("post delete failed");
    }

    await Likes.deleteMany({post: postId}, opts);
    await Comments.deleteMany({post: postId}, opts);
    await session.commitTransaction();

    console.log("Transcation Successful");
  } catch (err) {
    console.log("Error", err);
    await session.abortTransaction();
    console.log("Transaction Failed");
    return res.json({message: "server error"});
  } finally {
    session.endSession();
  }

  return res.json({message: "post deleted successfully"});
}

async function toggleLike(req, res) {
  try {

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
  } catch (err) {
    console.log("Error: ", err);
    return res.json({error: err});
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

async function getCommentsForPost(req, res) {
  try {
    const postId = req.params.id;
    const limit = 25;
    const cursor = req.query.c;

    if (cursor && !mongoose.Types.ObjectId.isValid(cursor)) {
      return res.status(400).json({message: "invalid cursor"});
    }

    const query = { post: postId };
    if (cursor) {
      query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
    }

    const comments = await Comments.find(query)
      .sort({_id: -1})
      .limit(limit + 1)
      .populate("user", "_id username");

    if (comments.length === 0) {
      return res.status(200).json({
        comments: [],
        nextCursor: null
      });
    }

    const hasNextPage = comments.length > limit;
    if (hasNextPage) {
      comments.pop()
    }

    return res.status(200).json({
      comments: comments,
      nextCursor: hasNextPage ? comments[comments.length - 1]._id : null
    });

  } catch (err) {
    console.log("Error: ", err);
    return res.status(500).json({message: "server error"});
  }
}

export {
  getPosts,
  getPostById,
  postPosts,
  toggleLike,
  putPost,
  deletePost,
  postComment,
  getCommentsForPost
}