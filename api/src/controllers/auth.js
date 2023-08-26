const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { loggerUtil } = require("../utils/logger");
const {
  OK,
  WRONG_ENTITY,
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
  INTERNAL_SERVER_ERROR,
} = require("../utils/statusCode");
const User = require("../models/UserModel");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const { hashPassword, authenticate } = require("../helper/auth");
const dotenv = require("dotenv");

const signUpp = async (req, res) => {
  // const errors = validationResult(req) || [];
  // if (!errors.isEmpty()) {
  //   return res.status(WRONG_ENTITY).json({
  //     errors: errors.array(),
  //   });
  // }
  const { name, email, password } = req.body;
  try {
    const lastUser = await User.findOne().sort({ userId: -1 });
    const userId = lastUser ? lastUser.userId + 1 : 1;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(BAD_REQUEST).json({
        error: "Email address already registered.",
      });
    }

    const hashedPassword = hashPassword(password, process.env.SALT || "");

    const newUser = new User({
      userId,
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const expiryTime = new Date();
    expiryTime.setMonth(expiryTime.getMonth() + 6);
    const exp = expiryTime.getTime() / 1000;
    const token = jwt.sign(
      { _id: newUser.id, exp: exp },
      process.env.SECRET || ""
    );

    res.status(OK).json({
      status: OK,
      message: "User registered successfully.",
      data: newUser,
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({
      error: "An error occurred while processing your request.",
    });
  }
};

const login = async (req, res) => {
  const errors = validationResult(req) || [];
  loggerUtil(req.body);
  if (!errors.isEmpty()) {
    return res.status(WRONG_ENTITY).json({
      status: WRONG_ENTITY,
      error: errors.array()[0]?.msg,
    });
  }
  const { email, password } = req.body;
  try {
    User.findOne({ email }).then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).json({
          status: NOT_FOUND,
          error: "User Not Found.",
        });
      }
      const userData = user;
      if (!authenticate(password, process.env.SALT || "", userData.password)) {
        return res.status(UNAUTHORIZED).json({
          status: UNAUTHORIZED,
          error: "Oops!, E-mail or Password is incorrect!",
        });
      }
      const expiryTime = new Date();
      expiryTime.setMonth(expiryTime.getMonth() + 6);
      const exp = expiryTime.getTime() / 1000;
      const token = jwt.sign(
        { _id: userData.id, exp: exp },
        process.env.SECRET || ""
      );
      res.cookie("Token", token, {
        expires: new Date(Date.now() + 900000),
        httpOnly: true,
      });

      return res.status(OK).json({
        status: OK,
        message: "User Logged in Successfully!",
        token,
        data: userData,
      });
    });
  } catch (err) {
    loggerUtil(err, "ERROR");
  } finally {
    loggerUtil(`Sign up API called by user - UserName: -${req.body.email}`);
  }
};

const signout = (req, res) => {
  res.clearCookie("Token");
  res.status(OK).json({
    status: OK,
    message: "User Signed Out Sucessfully!",
  });
};

module.exports = {
  login,
  signout,
  signUpp,
};
