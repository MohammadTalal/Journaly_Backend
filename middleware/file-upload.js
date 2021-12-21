// This file is a middleware that controlles uploading images into the website.
// The images will be stored locally in the backend not in the database
// The database include on the path to the stored images.
const multer = require("multer");
const uuid = require("uuid");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
const fileUpload = multer({
  limits: 500000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/images");
    },
    filename: (req, file, cb) => {
      // Extract extension
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuid.v1() + "." + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid mim type!");
    cb(error, isValid);
  },
});

module.exports = fileUpload;
