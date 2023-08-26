const express = require("express");
const multer = require("multer");
const { check, body } = require("express-validator");
const {
  isSignedIn,
  isValidToken,
  isSameUserOrAdmin,
} = require("./../middleware/index");
const {
  signUp,
  login,
  signout,

  signUpp,
} = require("../controllers/auth");
const User = require("../models/UserModel");
const { memoryStorage } = require("multer");
const path = require("path");

const authRoute = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads");
  },
  filename: (req, file, cb) => {
    // console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

authRoute.post(
  "/signupp",
  [
    check("name").trim().notEmpty().withMessage("Name is required."),
    check("email")
      .isEmail()
      .withMessage("Please provide a valid email address.")
      .custom((value) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("Email address already registered.");
          }
        });
      }),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password length should be minimum of 8 characters."),
  ],
  signUpp
);

authRoute.post(
  "/login",
  [
    check("email")
      .isLength({ min: 3 })
      .withMessage("Please provide a valid email address."),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password length should be minimum of 8 characters."),
    body().custom((value, { req }) => {
      if (!req.body.email) {
        throw new Error("Please enter your email.");
      }
      if (!req.body.password) {
        throw new Error("Please enter your password.");
      }
      return true;
    }),
  ],
  login
);

authRoute.get("/signout", signout);



module.exports = authRoute;
