import User from "../models/User.js";
import Post from "../models/Post.js";
import Likes from "../models/Likes.js";
import mongoose from "mongoose";

async function getProfile(req, res) {
  try {
    const userId = req.user.id
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({message: "user not found"});
    }

    return res.status(200).json({
      username: user.username,
      bio: user.bio || ""
    });
  } catch (err) {
    console.log("Error: ", err);
    return res.status(500).json({message: "server error"});
  }
}

async function putPfp(req, res) {
  console.log(req.file);
  return res.json({"message": "OK"});
} 

async function getLikedPosts(req, res) {
  try {
    const userId = req.user.id;
    const limit = 25;
    const cursor = req.params.c;

    if (cursor && !mongoose.Types.ObjectId.isValid(cursor)) {
      return res.status(400).json({message: "invalid cursor"});
    }

    const query = { _id: userId };
    if (cursor) {
      query._id = { $lt: cursor };
    }

    const likedPosts = await Likes.find(query)
      .sort({_id: -1})
      .limit(limit + 1)
      .populate("post");

    if (likedPosts.length === 0) {
      return res.status(200).json({
        posts: [],
        nextCursor: null
      });
    }

    const hasNextPost = posts.length > limit;
    if (hasNextPost) {
      posts.pop();
    }

    return res.status(200).json({
      posts: posts,
      nextCursor: hasNextPost ? posts[posts.length - 1]._id : null
    });
  } catch (err) {
    console.log("Error: ", err);
  }
}

async function putBio(req, res) {
  try {
    const userId = req.user.id;
    const { bioContent } = req.body;
    if (!bioContent || bioContent.trim().length < 1 || bioContent.length > 150) {
      return res.status(400).json({message: "invalid input"});
    }

    // const updatedUser = await User.updateOne({_id: userId}, { $set: { bio: bioContent.trim() } });
    
    const updatedUser = await User.findByIdAndUpdate( // returns updated bio
      {_id: userId}, 
      { bio: bioContent.trim() }, 
      { new: true, select: "bio" }
    );
    if (updatedUser.matchedCount === 0) {
      return res.status(404).json({message: "user not found"});
    }
    
    return res.status(200).json({message: "bio updated successfully"});
  } catch (err) {
    console.log("Error: ", err);
    return res.status(500).json({message: "server error"});
  }
}

export {
  getProfile,
  putPfp,
  getLikedPosts,
  putBio
}