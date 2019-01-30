const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

// Load Validation functions
const validateProfileInput = require("../validation/profile");
const validateExperienceInput = require("../validation/experience");
const validateEducationInput = require("../validation/education");

// Load Profile Model
const Profile = require("./profileModel");
// Load User Profile
const User = require("../users/userModel");

const router = express.Router();

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Profile works" }));

// @route   GET api/profile/
// @desc    Get Current user's profile
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const errors = {};
    try {
      const profile = await Profile.findOne({ user: req.user._id }).populate(
        "user",
        ["name", "avatar"]
      );
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        return res.status(404).json(errors);
      }
      res.json(profile);
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get("/all", async (req, res) => {
  const errors = {};
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    if (!profiles) {
      errors.noprofiles = "There are no profiles";
      return res.status(404).json(errors);
    }
    res.json(profiles);
  } catch (error) {
    res.status(400).json({ profile: "There are no profiles" });
  }
});

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get("/handle/:handle", async (req, res) => {
  const errors = {};
  const { handle } = req.params;
  try {
    const profile = await Profile.findOne({ handle }).populate("user", [
      "name",
      "avatar"
    ]);
    if (!profile) {
      errors.noprofile = "There is no profile for this user";
      return res.status(404).json(errors);
    }
    res.json(profile);
  } catch (error) {
    res.status(400).json(error);
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get("/user/:userId", async (req, res) => {
  const errors = {};
  const { userId } = req.params;
  try {
    const profile = await Profile.findOne({ user: userId }).populate("user", [
      "name",
      "avatar"
    ]);
    if (!profile) {
      errors.noprofile = "There is no profile for this user";
      return res.status(404).json(errors);
    }
    res.json(profile);
  } catch (error) {
    res.status(400).json({ profile: "There is not profile for this user" });
  }
});

// @route   POST api/profile/
// @desc    Create or edit user profile
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Validate
    const { errors, isValid } = validateProfileInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    // Get fields
    const profileFields = {};
    profileFields.user = req.user._id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    // Skills - Split into array
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    (async function CreateOrUpdateProfile() {
      try {
        const profile = await Profile.findOne({ user: req.user._id });
        if (profile) {
          // Update
          const updatedProfile = await Profile.findOneAndUpdate(
            { user: req.user._id },
            { $set: profileFields },
            { new: true }
          );
          res.json(updatedProfile);
        } else {
          // Check if handle exists
          const profileHandle = await Profile.findOne({
            handle: profileFields.handle
          });
          if (profileHandle) {
            errors.handle = "That handle already exists";
            return res.status(400).json(errors);
          }

          // Save profile
          const savedProfile = await new Profile(profileFields).save();
          res.json(savedProfile);
        }
      } catch (error) {
        res.status(400).json(error);
      }
    })();
  }
);

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    try {
      let profile = await Profile.findOne({ user: req.user._id });
      // Cloning req.body object into newExp object
      const newExp = {
        ...req.body
      };
      // Add to exp array
      profile.experience.unshift(newExp);
      profile = await profile.save();
      res.json(profile);
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    try {
      let profile = await Profile.findOne({ user: req.user._id });
      // Cloning req.body object into newExp object
      const newEdu = {
        ...req.body
      };
      // Add to edu array
      profile.education.unshift(newEdu);
      profile = await profile.save();
      res.json(profile);
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

// @route   DELETE api/profile/experience/:id
// @desc    Delete experience from profile
// @access  Private
router.delete(
  "/experience/:expId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { expId } = req.params;
    try {
      let profile = await Profile.findOne({ user: req.user._id });
      // Get remove index
      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(expId);
      // Splice out of array
      profile.experience.splice(removeIndex, 1);
      profile = await profile.save();
      res.json(profile);
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

// @route   DELETE api/profile/education/:id
// @desc    Delete education from profile
// @access  Private
router.delete(
  "/education/:eduId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { eduId } = req.params;
    try {
      let profile = await Profile.findOne({ user: req.user._id });
      // Get remove index
      const removeIndex = profile.education.map(item => item.id).indexOf(eduId);
      // Splice out of array
      profile.education.splice(removeIndex, 1);
      profile = await profile.save();
      res.json(profile);
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

// @route   DELETE api/profile
// @desc    Delete User and Profile
// @access  Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOneAndDelete({ user: req.user._id });
      const user = await User.findByIdAndDelete(req.user._id);
      res.json({ msg: "User deleted" });
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

module.exports = router;
