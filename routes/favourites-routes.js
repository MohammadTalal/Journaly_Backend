const express = require("express");
const favouritesController = require("../controllers/favourites-controller");
const router = express.Router();

//this route add wishlist and return the latest favourites post
router.post("/", favouritesController.addFavourite);
// when user click heart the post this route call and delete favourites from database favourites table
router.delete("/", favouritesController.DeleteFavourites);

// this routes is used when use click delete button not from heart

router.delete("/favourite", favouritesController.DeleteFromFavourites);
// this delete call when user try to delete post which post has been added to wishlist then also delete post from favourites section
router.delete(
  "/deletewithpost",
  favouritesController.DeleteFavouritesWhenPostDelete
);

//this check the a specific post has been already added to wishlist or not?
router.get("/:id/:postid", favouritesController.checkFavourites);
//this return all favourites of posts
router.get("/:userid", favouritesController.getFavouritesPosts);

module.exports = router;
