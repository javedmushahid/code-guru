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
  forgotPassword,
  resetPassword,
  validateOTP,
  getAllUsers,
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
  "/signup",
  [
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
    check("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match.");
      }
      return true;
    }),
  ],
  upload.single("profilePicture"),
  signUp
);

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

authRoute.post(
  "/forgot-password",
  [
    check("email")
      .isEmail()
      .withMessage("Please provide a valid email address.")
      .custom((value) => {
        return User.findOne({ email: value }).then((user) => {
          if (!user) {
            return Promise.reject("Email address not found.");
          }
        });
      }),
  ],
  forgotPassword
);

authRoute.post(
  "/reset-password/:userId",
  [
    check("newPassword")
      .isLength({ min: 8 })
      .withMessage("Password length should be minimum of 8 characters."),
    check("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.confirmPassword) {
        throw new Error("Passwords do not match.");
      }
      return true;
    }),
  ],
  resetPassword
);

authRoute.post(
  "/verify-otp",
  [
    check("otp")
      .isNumeric()
      .withMessage("OTP should be numeric.")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP should be 6 digits."),
  ],
  validateOTP
);


module.exports = authRoute;
