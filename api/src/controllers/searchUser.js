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

const search=async(req,res)=>{


    try {
      const {userId}=req.params;
      const user=await User.findOne({userId});

      if(!userId){
        return res.status(NOT_FOUND).json({message:'User not found'})
      }

        const keyword = req.query.search;
         const users = await User.find({
      $and: [
        {
          _id: { $ne: user._id }
        },
        {
          $or: [
            { email: { $regex: keyword, $options: "i" } },
            { name: { $regex: keyword, $options: "i" } }
          ]
        }
      ]
    });
    if (users.length === 0) {
      return res.status(NOT_FOUND).json({ message: 'No user found' });
    }
        return res.status(OK).json({
            status:OK,
            message:'Searched Successfull',
            data:users
        })

    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });    
    }

}


module.exports={search}