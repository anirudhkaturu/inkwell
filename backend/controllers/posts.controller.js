import Post from "../models/Post.js";
import Likes from "../models/Likes.js"

async function getPosts(req, res) {
  // pagination 
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const offset = (page - 1) * limit;

  const posts = await Post.find()
  .sort({ createdAt: -1 })
  .skip(offset)
  .limit(limit);

  if (posts.length < 1) {
    return res.json([]);
  }

  return res.status(200).json(posts);
}

async function getPostById(req, res) {
  const post = await Post.findById(req.body.id);
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
    await Post.updateOne({_id: postId}, {$inc: {likes: -1}});

    return res.json({message: "unliked"});
  }
}

export {
  getPosts,
  getPostById,
  postPosts,
  toggleLike
}