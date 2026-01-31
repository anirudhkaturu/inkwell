import User from "../models/User.js";
import Post from "../models/Post.js";

async function getProfile(req, res) {
  const userId = req.user.id
  const userPosts = await Post.find({author: userId});
  
  if (!userPosts || userPosts.lenght < 1) {
    return res.json({"message": "you havent posted anything"});
  }
  
  return res.json(userPosts);
}

export {
  getProfile
}