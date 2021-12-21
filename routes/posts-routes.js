const express = require("express");
const { check } = require("express-validator");
const fileUpload = require("../middleware/file-upload");
const postsControllers = require("../controllers/posts-controllers");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

// Get all posts
router.get("/", postsControllers.getAllPosts);
// Get filtered posts
router.post("/filter", postsControllers.filterPostsByDate);

// Get a specific post (journal) by the post id
router.get("/:pid", postsControllers.getPostById);

// Get all the posts (journals) for a specific by user id
router.get("/user/:uid", postsControllers.getPostsByUserId);

router.use(checkAuth);

// Add a new post (journal) route
router.post(
  "/",
  fileUpload.single("image"),
  [check("title").not().isEmpty(), check("content").not().isEmpty()],
  postsControllers.createPost
);

// Update an existing post (journal) route
router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("content").not().isEmpty()],
  postsControllers.updatePost
);

// Delete an existing post (journal) route
router.delete("/:pid", postsControllers.deletePost);

// Export router
module.exports = router;
