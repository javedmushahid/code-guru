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
const User=require("../models/UserModel")

const getRandomUser = async (req, res) => {
    try {
    //   const count = await Myprofile.countDocuments();
    const count = await Myprofile.countDocuments();
      const randomIndex = Math.floor(Math.random() * count);
      const fetchedUserIds = [];
        
      let user = await Myprofile.findOne().skip(Math.floor(Math.random() * count)).populate({
        path: 'user',
        select: 'firstName lastName gender profilePicture address',
        options: { strictPopulate: false }
    });
    while (fetchedUserIds.includes(user._id)) {
        user = await Myprofile.findOne().skip(Math.floor(Math.random() * count)).populate({
            path: 'user',
            select: 'firstName lastName gender profilePicture address',
            options: { strictPopulate: false }
        });
    }
    
    fetchedUserIds.push(user._id);
    res.status(OK).json({
        Status: OK,
        message: "Random User Fetched successfully",
        data: {
            fullName: `${user.firstName} ${user.lastName}`,
            profilePicture: user.profilePicture,
            gender: user.gender,
        },
    });

    } catch (err) {
      console.error('Failed to get random user:', err);
      res.status(INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  };
  

module.exports={getRandomUser}