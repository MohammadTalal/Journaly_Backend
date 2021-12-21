const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cloudinary = require("../utils/cloudinary");

const uuid = require("uuid");
const { validationResult } = require("express-validator"); // import the validationResult method only from the express-validator
const db = require("../db");
const HttpError = require("../models/http-error");

const getUsers = (req, res, next) => {
  try {
    db.query(
      "SELECT * FROM users ORDER BY registerDate DESC",
      (error, result) => {
        if (error) {
          console.log(error);
        } else {
          res.status(201).json({ users: result });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
  // res.json({ users: DUMMY_USERS });
};

// Signup controller - store user info into the database.
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed, please check you data.", 422);
  }

  const { name, email, password } = req.body;

  db.query(
    "SELECT email FROM users WHERE email = ?",
    [email],
    async (error, result) => {
      if (error) {
        console.log(error);
      } else {
        if (result.length > 0) {
          res
            .status(422)
            .json({ message: "Email Already Exists. Please Go To Sign In." });
        } else {
          // use bcrypt to hash the password
          let hashedPassword = await bcrypt.hash(password, 8);
          let newUser = {
            id: uuid.v4(),
            name: name,
            email: email,
            password: hashedPassword,
            date: new Date(),
          };

          db.query(
            "INSERT INTO users (id, name, email, password, registerDate) VALUES (?, ?, ?, ?, ?)",
            [
              newUser.id,
              newUser.name,
              newUser.email,
              newUser.password,
              newUser.date,
            ],
            (error, result) => {
              if (error) {
                console.log(error);
              } else {
                let token;
                try {
                  token = jwt.sign(
                    { userId: newUser.id, email: newUser.email },
                    "secret_dont_share",
                    { expiresIn: "1h" }
                  );
                } catch (err) {
                  res.status(500).json({
                    message: "Signing up failed, please try again later.",
                  });
                }
                res.status(201).json({
                  userId: newUser.id,
                  email: newUser.email,
                  token: token,
                });
              }
            }
          );
        }
      }
    }
  );
};

// Signin Controller - First, it checks if the email exist, and then it check if password is correct
const signin = async (req, res, next) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (error, result) => {
      if (error) {
        console.log(error);
      } else {
        if (result.length === 0) {
          res
            .status(422)
            .json({ message: "Email Dose Not Exist. Please Sign Up First." });
        } else {
          let hashedPassword = result[0].password;
          let isValidPassword = await bcrypt.compare(password, hashedPassword);
          if (isValidPassword) {
            let token;
            try {
              token = jwt.sign(
                { userId: result[0].id, email: result[0].email },
                "secret_dont_share",
                { expiresIn: "1h" }
              );
            } catch (err) {
              res.status(500).json({
                message: "Signing In Failed, Please Try Again Later.",
              });
            }
            // we also send role and status in response so that we can take action on the base of them.
            res.status(201).json({
              userId: result[0].id,
              email: result[0].email,
              token: token,
              role: result[0].role,
              status: result[0].status,
            });
          } else {
            res
              .status(401)
              .json({ message: "Could Not Sign In. Invalid Credentials" });
          }
        }
      }
    }
  );
};
// this return the name of user the user which is authenticated
const getUserName = async (req, res, next) => {
  const userId = req.params.id;
  db.query(`SELECT * from users where id='${userId}'`, (error, result) => {
    if (error) {
      console.log("error");
    } else {
      res.status(201).json({ username: result });
    }
  });
};
// this return the role of user the user which is authenticated
const getUserRole = async (req, res, next) => {
  const userId = req.params.id;
  db.query(`SELECT role from users where id='${userId}'`, (error, result) => {
    if (error) {
      console.log("error");
    } else {
      res.status(201).json({ role: result });
    }
  });
};
// this return  the status of user
// this only change the status field from database and return update data
const changeStatus = async (req, res, next) => {
  const userId = req.params.id;
  // Extract user inputs
  const { name, email, password, imageUrl, registerDate, role, status } =
    req.body;

  // Update user status
  db.query(
    "UPDATE users SET  name= ?, email = ? ,password= ?, imageUrl= ? ,registerDate= ?, role=?, status= ? WHERE id = ?",
    [
      name,
      email,
      password,
      imageUrl,
      new Date(registerDate),
      role,
      status,
      userId,
    ],
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        // Send back a responce by the new updated user
        res.status(200).json({ user: result[0] });
      }
    }
  );
};

// this only change the Image of user
const changeUserImage = async (req, res, next) => {
  const userId = req.params.id;
  // Extract user inputs
  let { image } = req.body;
  image = req.file.path;
  if (!image) {
    image = null;
  }
  const result = await cloudinary.uploader.upload(req.file.path);

  // Edit User Image query
  db.query(
    "UPDATE users SET  imageUrl= ?  WHERE id = ?",
    [result.secure_url, userId],
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        // Send back a responce by the new updated user
        res.status(200).json({ user: result[0] });
      }
    }
  );
};

// this function only chnage the password of user

const changeUserPassword = async (req, res, next) => {
  const userId = req.params.id;
  // Extract user inputs
  console.log(req.body);
  let { password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 8);

  // Edit Password
  db.query(
    "UPDATE users SET  password= ? WHERE id = ?",
    [hashedPassword, userId],
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        res.status(200).json({ user: result[0] });
      }
    }
  );
};
// this route is used for verify the password so that we can match old password and get verification
const verifyPassword = async (req, res, next) => {
  const userId = req.params.id;

  // Extract user inputs
  const { old_password } = req.body;
  // Edit Password
  db.query(
    "SELECT * FROM users WHERE id = ?",
    [userId],
    async (error, result) => {
      if (error) {
        console.log(error);
      } else {
        const userpassword = result[0].password;
        isValidPassword = await bcrypt.compare(old_password, userpassword);
        if (isValidPassword) {
          res.status(200).json({ verifyPassword: true });
        } else {
          res.status(200).json({ verifyPassword: false });
        }
      }
    }
  );
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.signin = signin;
exports.getUserName = getUserName;
exports.getUserRole = getUserRole;
exports.changeStatus = changeStatus;
exports.changeUserImage = changeUserImage;
exports.changeUserPassword = changeUserPassword;
exports.verifyPassword = verifyPassword;
