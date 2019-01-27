const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const usersRouter = require("./backend/users/usersRouter");
const profileRouter = require("./backend/profiles/profilesRouter");
const postsRouter = require("./backend/posts/postsRouter");

const app = express();

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require("./backend/config/keys").MONGODB_URI;

// Connect to MongoDb
mongoose.connect(
  db,
  { useNewUrlParser: true },
  err => {
    if (!err) {
      console.log("MongodDB Connected");
    }
  }
);

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./backend/config/passport")(passport);

// Use Routes
app.use("/api/users", usersRouter);
app.use("/api/profile", profileRouter);
app.use("/api/posts", postsRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
