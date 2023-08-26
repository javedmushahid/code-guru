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

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mushaid@flynaut.com", // Healthtag Email Address
    pass: "Mushahid@786", // Healthtag password
  },
});

function generateOTP() {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

const signUp = async (req, res) => {
  const errors = validationResult(req) || [];
  // if (!errors.isEmpty()) {
  //   return res.status(WRONG_ENTITY).json({
  //     errors: errors.array(),
  //   });
  // }
  const { name, email, password, confirmPassword } = req.body;
  try {
    const lastUser = await User.findOne().sort({ userId: -1 });
    const userId = lastUser ? lastUser.userId + 1 : 1;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(BAD_REQUEST).json({
        error: "Email address already registered.",
      });
    }
    if (password !== confirmPassword) {
      return res.status(BAD_REQUEST).json({
        error: "Password does not match.",
      });
    }
    // const otp = "123456";
    const otp = generateOTP();
    const mailOptions = {
      from: "mushaid@flynaut.com",
      to: email,
      subject: "Signup Verification OTP",
      html: `
          <div style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.5; text-align: center;">
            <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">Signup Verification OTP</h2>
            <p style="margin-bottom: 20px;">Your OTP for signup verification is:</p>
            <div style="border: 3px solid #6c757d; padding: 20px; border-radius: 10px; display: inline-block;">
              <p style="font-size: 28px; font-weight: bold; margin-bottom: 20px;">${otp}</p>
            </div>
            <p style="margin-top: 20px;">Please enter this OTP to complete the signup process.</p>
            <div style="padding: 10px; border-radius: 5px;">
              <p style="font-size: 12px; margin-bottom: 5px;">Note: This is a system-generated email. Please do not reply.</p>
              <p style="font-size: 12px; margin-bottom: 5px;">If you did not request this email, please ignore and delete it.</p>
            </div>
          </div>
        `,
    };

    transporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
        console.log(error);
        return res.status(INTERNAL_SERVER_ERROR).json({
          error: "An error occurred while sending email.",
        });
      } else {
        console.log("Email sent: " + info.response);

        const hashedPassword = hashPassword(password, process.env.SALT || "");
        const confirmHashedPassword = hashPassword(
          confirmPassword,
          process.env.SALT || ""
        );
        const profilePicture = req.file ? req.file.filename : null;
        const newUser = new User({
          userId,
          name,
          profilePicture,
          email,
          password: hashedPassword,
          confirmPassword: confirmHashedPassword,
          otp,
        });
        await newUser.save();

        const expiryTime = new Date();
        expiryTime.setMonth(expiryTime.getMonth() + 6);
        const exp = expiryTime.getTime() / 1000;
        const token = jwt.sign(
          { _id: newUser.id, exp: exp },
          process.env.SECRET || ""
        );
        res.cookie("Token", token, {
          expires: new Date(Date.now() + 900000),
          httpOnly: true,
        });
        res.status(OK).json({
          status: OK,
          message: "User registered successfully.",
          data: newUser,
          token,
        });
      }
    });

    // const hashedPassword = hashPassword(password, process.env.SALT || "");
    // const confirmHashedPassword = hashPassword(
    //   confirmPassword,
    //   process.env.SALT || ""
    // );
    // const newUser = new User({
    //   userId,
    //   email,
    //   password: hashedPassword,
    //   confirmPassword: confirmHashedPassword,
    //   otp,
    // });
    // await newUser.save();

    // res.status(OK).json({
    //   status: OK,
    //   message: "User registered successfully.",
    //   data: newUser,
    // });
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({
      error: "An error occurred while processing your request.",
    });
  }
};

const signUpp = async (req, res) => {
  const errors = validationResult(req) || [];
  if (!errors.isEmpty()) {
    return res.status(WRONG_ENTITY).json({
      errors: errors.array(),
    });
  }
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

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(NOT_FOUND).json({
        status: NOT_FOUND,
        error: "User Not Found.",
      });
    }

    const otp = generateOTP();
    const mailOptions = {
      from: "mushaid@flynaut.com",
      to: email,
      subject: "Password Reset OTP",
      html: `
          <div style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.5; text-align: center;">
            <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">Password Reset OTP</h2>
            <p style="margin-bottom: 20px;">Your OTP for password reset is:</p>
            <div style="border: 3px solid #6c757d; padding: 20px; border-radius: 10px; display: inline-block;">
              <p style="font-size: 28px; font-weight: bold; margin-bottom: 20px;">${otp}</p>
            </div>
            <p style="margin-top: 20px;">Please enter this OTP to reset your password.</p>
            <div style="padding: 10px; border-radius: 5px;">
              <p style="font-size: 12px; margin-bottom: 5px;">Note: This is a system-generated email. Please do not reply.</p>
              <p style="font-size: 12px; margin-bottom: 5px;">If you did not request this email, please ignore and delete it.</p>
            </div>
          </div>
        `,
    };

    transporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({
          error: "An error occurred while sending email.",
        });
      } else {
        console.log("Email sent: " + info.response);

        user.otp = otp;
        await user.save();

        return res.status(OK).json({
          status: OK,
          message:
            "An email has been sent to your email address with instructions on how to reset your password.",
        });
      }
    });
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({
      error: "An error occurred while processing your request.",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req) || [];

    if (!errors.isEmpty()) {
      return res.status(WRONG_ENTITY).json({
        status: WRONG_ENTITY,
        error: errors.array()[0]?.msg,
      });
    }

    const { newPassword, confirmPassword } = req.body;
    console.log(newPassword, confirmPassword);
    if (newPassword !== confirmPassword) {
      return res.status(BAD_REQUEST).json({
        status: BAD_REQUEST,
        error: "New password and confirmed password do not match.",
      });
    }

    const { userId } = req.params;

    const user = await User.findOne({ userId: userId });

    if (!user) {
      return res.status(NOT_FOUND).json({
        status: NOT_FOUND,
        error: "User not found.",
      });
    }

    const hashedPassword = hashPassword(newPassword, process.env.SALT || "");
    const confirmHashedPassword = hashPassword(
      confirmPassword,
      process.env.SALT || ""
    );
    console.log(hashedPassword, confirmHashedPassword);

    user.password = hashedPassword;
    user.confirmPassword = confirmHashedPassword;

    const updatedUser = await user.save();

    return res.status(OK).json({
      status: OK,
      message: "Password successfully updated.",
      data: updatedUser,
    });
  } catch (err) {
    res.status(BAD_REQUEST).json({
      status: BAD_REQUEST,
      error: "Something went wrong.",
    });
  }
};

const validateOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(BAD_REQUEST).json({
        error: "User not found.",
      });
    }

    if (user.otp !== otp) {
      return res.status(BAD_REQUEST).json({
        error: "Invalid OTP.",
      });
    }

    // Clear the OTP after successful validation
    user.otp = null;
    await user.save();

    res.status(OK).json({
      status: OK,
      message: "OTP validation successful.",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({
      error: "An error occurred while processing your request.",
    });
  }
};


module.exports = {
  signUp,
  login,
  signout,
  forgotPassword,
  resetPassword,
  validateOTP,
  signUpp,
};
