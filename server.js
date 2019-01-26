const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const usersRouter = require("./backend/users/usersRouter");
const profileRouter = require("./backend/users/profileRouter");
const postsRouter = require("./backend/posts/postsRouter");

const app = express();

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

app.get("/", (req, res) => res.send("Hello"));

// Use Routes
app.use("/api/users", usersRouter);
app.use("/api/profile", profileRouter);
app.use("/api/posts", postsRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
