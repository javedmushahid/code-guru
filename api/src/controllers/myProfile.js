const express = require("express");
const { loggerUtil } = require("../utils/logger");
const {
  OK,
  WRONG_ENTITY,
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
  INTERNAL_SERVER_ERROR,
} = require("../utils/statusCode");
const Myprofile = require("../models/MyprofileModel");
const User = require("../models/UserModel");

const addMyProfile = async (req, res) => {
  try {
    const { name, email, bio, gender, country } = req.body;

    const profileData = {
      name,
      email,
      bio,
      profilePicture: req.files?.profilePicture
        ? req.files.profilePicture[0].filename
        : null,
      country,
      gender,
    };

    console.log("data", profileData);

    const newProfile = await Myprofile.create(profileData);

    res.status(OK).json({
      status: OK,
      message: "User Profile added successfully",
      data: newProfile,
    });
  } catch (err) {
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};


const getMyProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(NOT_FOUND).json({ error: "User profile not found" });
    }
    const myprofile = await Myprofile.find({ user: user._id });
    res.status(OK).json({
      Status: OK,
      message: "User Profile retrieved successfully",
      data: myprofile,
    });
  } catch (err) {
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

const getAllMyProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(NOT_FOUND).json({ error: "User profile not found" });
    }
    const myprofile = await Myprofile.find();
    res.status(OK).json({
      Status: OK,
      message: "User Profile retrieved successfully",
      data: myprofile,
    });
  } catch (err) {
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

const filterProfiles = async (req, res) => {
  try {
    const { userId } = req.params;
    const { gender, country } = req.query;

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(NOT_FOUND).json({ error: "User profile not found" });
    }

    let pipeline = [];

    if (gender) {
      pipeline.push({
        $match: { gender: { $regex: `^${gender}$`, $options: 'i' } } 
      });
    }

    if (country) {
      pipeline.push({
        $match: { country: { $regex: `^${country}$`, $options: 'i' } }
      });
    }

    if (!gender && !country) {
      const allProfiles = await Myprofile.find();
      return res.status(OK).json({
        status: OK,
        message: "All profiles retrieved successfully",
        data: allProfiles,
      });
    }

    const profiles = await Myprofile.aggregate(pipeline);
    if (profiles.length === 0) {
      return res.status(NOT_FOUND).json({ message: "No matching profiles found" });
    }

    res.status(OK).json({
      status: OK,
      message: "Filtered profiles retrieved successfully",
      data: profiles,
    });
  } catch (err) {
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};


const updateMyProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(NOT_FOUND).json({ error: "User profile not found" });
    }
    const updatedUserProfile = await Myprofile.findOneAndUpdate(
      { user },
      req.body,
      { new: true }
    );

    res.status(OK).json({
      Status: OK,
      message: "User Profile updated successfully",
      data: updatedUserProfile,
    });
  } catch (err) {
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

module.exports = {
  addMyProfile,
  getMyProfile,
  updateMyProfile,
  getAllMyProfile,
  filterProfiles
};
