const gravatar = require("gravatar");
const bcrpyt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = require("../config/keys").JWT_SECRET;

// Load Input Validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

// Load User Model
const User = require("./userModel");

async function register(req, res) {
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const { name, email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    }
    const avatar = gravatar.url(email, {
      s: "200", // Size
      r: "pg", // Rating
      d: "mm" // Default
    });
    const user = new User({ name, email, avatar, password });
    // Hashing password
    bcrpyt.genSalt(10, (err, salt) => {
      bcrpyt.hash(user.password, salt, (err, hash) => {
        if (err) throw err;
        user.password = hash;
        // Saving user
        (async function saveUser() {
          const newUser = await user.save();
          res.json(newUser);
        })();
      });
    });
  } catch (error) {
    res.status(400).json({ error });
  }
}

async function login(req, res) {
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const { email, password } = req.body;
  // Find user by email
  try {
    const user = await User.findOne({ email });
    if (!user) {
      errors.auth = "Authentication failed";
      return res.status(400).json(errors);
    }
    // Check password
    bcrpyt.compare(password, user.password, (err, isMatch) => {
      if (isMatch) {
        // JWT Payload
        const payload = {
          id: user._id,
          name: user.name,
          avatar: user.avatar
        };
        // Generate token
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
        res.json({
          token: "Bearer " + token
        });
      } else {
        errors.auth = "Authentication failed";
        return res.status(400).json(errors);
      }
    });
  } catch (error) {
    res.status(400).json({ error });
  }
}

function getCurrentUser(req, res) {
  res.json({ msg: `Current logged in user: ${req.user.name}` });
}

module.exports = {
  register,
  login,
  getCurrentUser
};
