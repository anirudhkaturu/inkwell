import User from "../models/User.js";
import Post from "../models/Post.js";
import Likes from "../models/Likes.js";

async function getProfile(req, res) {
  const userId = req.user.id
  const userPosts = await Post.find({author: userId});
  
  if (!userPosts || userPosts.lenght < 1) {
    return res.json({"message": "you havent posted anything"});
  }
  
  return res.json(userPosts);
}

async function putPfp(req, res) {
  console.log(req.file);
  return res.json({"message": "OK"});
} 

async function getLikes(req, res) {
  const userId = req.user.id;
  const userLikedPosts = await Likes.find({user: userId});

  return res.json({userLikedPosts});
}

export {
  getProfile,
  putPfp,
  getLikes
}