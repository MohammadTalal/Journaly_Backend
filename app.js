const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");

// using dotenv helps secure important data
dotenv.config({ path: "./.env" });
const usersRoutes = require("./routes/users-routes");
const postsRoutes = require("./routes/posts-routes");
const likesRoutes = require("./routes/likes-routes");
const favaouritesRoutes = require("./routes/favourites-routes");
const commentsRoutes = require("./routes/comments-routes");

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

// The following middleware is responsible for setting the headers of responses.
// Also, it determine which domain can have access to the backend.
// Furthermore, it controls which headers incoming requests to handle.
// It also controls which HTTP methods maybe used or attached to incoming request from the frontend.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

// Define the usersRoutes middleware
app.use("/api/users", usersRoutes);
// Define the postsRoutes middleware
app.use("/api/posts", postsRoutes);
// Define the likesRoutes middleware
app.use("/api/likes", likesRoutes);
// Define the favaouritesRoutes middleware
app.use("/api/favourites", favaouritesRoutes);
// Define the commentsRoutes middleware
app.use("/api/comments", commentsRoutes);


app.use(express.static(__dirname + "/build"));
app.use((req, res) => {
  const htmlPath = path.join(__dirname, "build", "index.html");
  res.sendFile(htmlPath);
});
// This is a special middleware funcation (Error Handling Middleware)
// which will be applied on every incoming request.
// And it will be executed on the requests that have an error attached to it.
app.use((error, req, res, next) => {
  // Check if file exists and delete it if exists
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  // Check if a response has already been sent.
  if (res.headerSend) {
    return next(error);
  }
  res.status(500).json({ message: "Something Went Wrong!" });
});
let port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log("Listening on " + port);
});
