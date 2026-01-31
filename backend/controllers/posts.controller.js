import Post from "../models/Post.js";

async function getPosts(req, res) {
  const posts = await Post.find();
  if (posts.length === 0 || !posts) {
    return res.json({"message": "no posts"});
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
  if (content.length < 1 && content.length > 5000) {
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

export {
  getPosts,
  getPostById,
  postPosts
}