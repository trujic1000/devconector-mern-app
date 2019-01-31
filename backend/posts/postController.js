// Post Model
const Post = require("./postModel");
// Load Validation
const validatePostInput = require("../validation/post");
// Profile Model
const Profile = require("../profiles/profileModel");

async function getAllPosts(req, res) {
  try {
    const posts = await Post.find().sort({ date: -1 });
    if (!posts) {
      return res.status(404).json({ posts: "Posts not found" });
    }
    res.json(posts);
  } catch (error) {
    res.status(400).json(error);
  }
}

async function getPostById(req, res) {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ post: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(404).json({ post: "Post not found" });
  }
}

async function createPost(req, res) {
  const { errors, isValid } = validatePostInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  try {
    let newPost = new Post({
      ...req.body,
      user: req.user._id
    });
    newPost = await newPost.save();
    res.json(newPost);
  } catch (error) {
    res.status(400).json(error);
  }
}

async function deletePost(req, res) {
  const { id } = req.params;
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    const post = await Post.findById(id);
    // Check for post owner
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ authorization: "User not authorized" });
    }
    // Delete
    const deletedPost = await post.remove();
    res.json({ success: "Post deleted" });
  } catch (error) {
    res.status(404).json({ post: "Post not found" });
  }
}

async function likePost(req, res) {
  const { id } = req.params;
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    let post = await Post.findById(id);
    if (
      post.likes.filter(
        like => like.user.toString() === req.user._id.toString()
      ).length > 0
    ) {
      return res.status(400).json({ like: "User already liked this post" });
    }
    // Add the user id to likes array
    post.likes.unshift({ user: req.user._id });
    post = await post.save();
    res.json(post);
  } catch (error) {
    res.status(404).json({ post: "Post not found" });
  }
}

async function unlikePost(req, res) {
  const { id } = req.params;
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    let post = await Post.findById(id);
    if (
      post.likes.filter(
        like => like.user.toString() === req.user._id.toString()
      ).length === 0
    ) {
      return res.status(400).json({ like: "You have not yet liked this post" });
    }
    // Get remove index
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user._id.toString());
    post.likes.splice(removeIndex, 1);
    post = await post.save();
    res.json(post);
  } catch (error) {
    res.status(404).json({ post: "Post not found" });
  }
}

async function commentPost(req, res) {
  const { errors, isValid } = validatePostInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  try {
    const { id } = req.params;
    let post = await Post.findById(id);
    const newComment = {
      ...req.body,
      user: req.user._id
    };
    // Add to comments array
    post.comments.unshift(newComment);
    post = await post.save();
    res.json(post);
  } catch (error) {
    res.status(404).json({ post: "Post not found" });
  }
}

async function deleteComment(req, res) {
  try {
    const { id, commentId } = req.params;
    let post = await Post.findById(id);
    // Check if comment exists
    if (
      post.comments.filter(
        comment => comment._id.toString() === commentId.toString()
      ).length === 0
    ) {
      return res.status(404).json({ comment: "Comment does not exist" });
    }
    // Get remove index
    const removeIndex = post.comments
      .map(comment => comment._id.toString())
      .indexOf(commentId.toString());
    // Splice comment out of the array
    post.comments.splice(removeIndex, 1);
    post = await post.save();
    res.json(post);
  } catch (error) {
    res.status(404).json({ post: "Post not found" });
  }
}

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  deletePost,
  likePost,
  unlikePost,
  commentPost,
  deleteComment
};
