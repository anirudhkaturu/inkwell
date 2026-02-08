import User from "../models/User.js";
import Post from "../models/Post.js";
import Likes from "../models/Likes.js";

async function getProfile(req, res) {
  try {
    const userId = req.user.id
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({message: "user not found"});
    }

    return res.status(200).json({
      username: user.username,
      bio: user.bio || null
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

async function getLikes(req, res) {
  const userId = req.user.id;
  const userLikedPosts = await Likes.find({user: userId}).populate("post");

  return res.json({userLikedPosts});
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
  getLikes,
  putBio
}