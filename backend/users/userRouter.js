const express = require("express");
const passport = require("passport");

// Load User Controller
const userController = require("./userController");

const router = express.Router();

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/register", userController.register);

// @route   POST api/users/login
// @desc    Login User / Returning JWT
// @access  Public
router.post("/login", userController.login);

// @route   POST api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  userController.getCurrentUser
);

module.exports = router;
