const uuid = require("uuid");
const db = require('../db');

// this method is used to add favourites of a specific post
const addFavourite = async (req, res, next) => {
  let { title, content, userId, postId, username, publishDate, imageUrl } =
    req.body;

  db.query(
    "INSERT INTO favourites (id, title,content,userId,postId,username,publishDate,imageUrl) VALUES (?,?,?,?,?,?,?,?)",
    [
      uuid.v4(),
      title,
      content,
      userId,
      postId,
      username,
      publishDate,
      imageUrl,
    ],
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        res.status(201).json({ disable: true });
      }
    }
  );
};

// The following method is used to hanlde the delete request for a specific post (journal).
const DeleteFavourites = (req, res, next) => {
  // Extract post id and post Id
  const { userId, postId } = req.body;

  db.query(
    "DELETE FROM favourites WHERE userId = ? AND postid = ?",
    [userId, postId],
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        res.status(200).json({ disable: false });
      }
    }
  );
};

// The following method is used to hanlde the delete favourties from a specific post (journal).
// this method call when you click delete button from post card
const DeleteFromFavourites = (req, res, next) => {
  // Extract post id and user id
  const { userId, postId } = req.body;

  // Delete favourites when user click the heart button from frontend
  db.query(
    "DELETE FROM favourites WHERE userId = ? AND id = ?",
    [userId, postId],
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        res.status(200).json({ disable: false });
      }
    }
  );
};

// The following method is used to hanlde the delete request for a specific post (journal).
const DeleteFavouritesWhenPostDelete = (req, res, next) => {
  const { userId, postId } = req.body;

  // Delete favourites when user click the heart again button from frontend
  db.query(
    "DELETE FROM favourites WHERE userId = ? AND postid = ?",
    [userId, postId],
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        res.status(200).json({ disable: false });
      }
    }
  );
};

// this check weather the specific user has added to favourites or not  a specific post

const checkFavourites = async (req, res, next) => {
  let userId = req.params.id;
  let postId = req.params.postid;
  db.query(
    "SELECT id FROM favourites WHERE userId LIKE ? AND postId LIKE ?",
    [userId, postId],
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        if (result.length == 0) {
          res.status(201).json({ disable: false });
        } else {
          res.status(201).json({ disable: true });
        }
      }
    }
  );
};

//This method is used to get all favourites posts and retunrs
const getFavouritesPosts = (req, res, next) => {
  const userId = req.params.userid;
  db.query(
    "SELECT *  FROM favourites WHERE userId=? ORDER BY publishDate desc",
    [userId],
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        res.status(201).json({ favourites: result });
      }
    }
  );
};

exports.addFavourite = addFavourite;
exports.checkFavourites = checkFavourites;
exports.getFavouritesPosts = getFavouritesPosts;
exports.DeleteFavourites = DeleteFavourites;
exports.DeleteFromFavourites = DeleteFromFavourites;
exports.DeleteFavouritesWhenPostDelete = DeleteFavouritesWhenPostDelete;
