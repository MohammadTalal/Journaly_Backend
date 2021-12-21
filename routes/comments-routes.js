const express = require("express");
const commentsController = require("../controllers/comment-controller");
const router = express.Router();
//this add the comment and return back the post comments
router.post("/", commentsController.addComment);
// get single post comments
router.get("/:id", commentsController.getComments);

module.exports = router;
