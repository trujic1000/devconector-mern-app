const express = require("express");
const passport = require("passport");

// Load Post Controller
const postController = require("./postController");

const router = express.Router();

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get("/", postController.getAllPosts);

// @route   GET api/posts/:id
// @desc    Get single post by id
// @access  Public
router.get("/:id", postController.getPostById);

// @route   POST api/posts
// @desc    Create Post
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  postController.createPost
);

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  postController.deletePost
);

// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  postController.likePost
);

// @route   POST api/posts/unlike/:id
// @desc    Unlike post
// @access  Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  postController.unlikePost
);

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  postController.commentPost
);

// @route   DELETE api/posts/comment/:id/:commentId
// @desc    Delete comment from post
// @access  Private
router.delete(
  "/comment/:id/:commentId",
  passport.authenticate("jwt", { session: false }),
  postController.deleteComment
);

module.exports = router;
