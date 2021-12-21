const express = require("express");
const likesController = require("../controllers/likes-controller");
const router = express.Router();

//this route addlikes and return the latest like of the post
router.post("/", likesController.addLike);
// when user unlike the post this route call and delete like from database likes table
router.delete("/", likesController.deletelike);
//this check the a specific post has been already liked or not?
router.get("/:id/:postid", likesController.checklike);
//this return all likes of which post id passed in params
router.get("/:postid", likesController.getLikes);

module.exports = router;
