const uuid = require("uuid");
const { validationResult } = require("express-validator");
const db = require('../db');


// add comment on database
const addComment = async (req, res, next) => {
  // Validate user inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    res
      .status(422)
      .json({ message: "Invalid Inputs Passed. Please Check Your Data." });
  } else {
    // Extract user inputs
    let { userId, postId, comment, username } = req.body;

    // Insert the new comment to the database
    db.query(
      "INSERT INTO comments (id,userId, postId,comment,name,postDate) VALUES (?, ?, ?, ?, ?, ?)",
      [uuid.v4(), userId, postId, comment, username, new Date()],
      (error, result) => {
        if (error) {
          console.log(error);
        } else {
          // Send back a success response
          // after submited the comment successfully we do another query
          // the purpose of this query to send back all comments of that post which id passed for comment
          db.query(
            `SELECT name,comment FROM comments where postId='${postId}'`,
            (error, result) => {
              if (error) {
                console.log(error);
              } else {
                res.status(201).json({ comments: result });
              }
            }
          );

          // res.status(201).json({ post: result[0] });
        }
      }
    );
  }
};
// this query simply get all comments all return all the comments to frontend
const getComments = async (req, res, next) => {
  const postId = req.params.id;
  try {
    db.query(
      `SELECT name,comment FROM comments where postId='${postId}'`,
      (error, result) => {
        if (error) {
          console.log(error);
        } else {
          res.status(201).json({ comments: result });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

exports.addComment = addComment;
exports.getComments = getComments;
