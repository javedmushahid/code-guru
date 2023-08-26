const express = require('express')
const { isSignedIn, isValidToken, isSameUserOrAdmin } = require('./../middleware/index');
const { addMyProfile, getMyProfile, updateMyProfile } = require('../controllers/myProfile');

const feedbackRoute=express.Router();

feedbackRoute.post("/my-profile/:userId",isSameUserOrAdmin,addMyProfile)

feedbackRoute.get("/my-profile/:userId",isSameUserOrAdmin,getMyProfile)
feedbackRoute.put("/my-profile/:userId",isSameUserOrAdmin,updateMyProfile)



module.exports=feedbackRoute;