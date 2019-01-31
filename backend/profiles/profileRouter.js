const express = require("express");
const passport = require("passport");

// Load Profile Controller
const profileController = require("./profileController");

const router = express.Router();

// @route   GET api/profile/
// @desc    Get Current user's profile
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  profileController.getCurrentProfile
);

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get("/all", profileController.getAllProfiles);

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get("/handle/:handle", profileController.getProfileByHandle);

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get("/user/:userId", profileController.getProfileByUserId);

// @route   POST api/profile/
// @desc    Create or edit user profile
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  profileController.createOrEditUserProfile
);

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  profileController.addExperience
);

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  profileController.addEducation
);

// @route   DELETE api/profile/experience/:id
// @desc    Delete experience from profile
// @access  Private
router.delete(
  "/experience/:expId",
  passport.authenticate("jwt", { session: false }),
  profileController.deleteExperience
);

// @route   DELETE api/profile/education/:id
// @desc    Delete education from profile
// @access  Private
router.delete(
  "/education/:eduId",
  passport.authenticate("jwt", { session: false }),
  profileController.deleteEducation
);

// @route   DELETE api/profile
// @desc    Delete Profile and User
// @access  Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  profileController.deleteProfileAndUser
);

module.exports = router;
