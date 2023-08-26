const express = require('express')
const { isSignedIn, isValidToken, isSameUserOrAdmin } = require('./../middleware/index');
const { addMyProfile, getMyProfile, updateMyProfile } = require('../controllers/myProfile');

const noteRoute=express.Router();

noteRoute.post("/my-profile/:userId",isSameUserOrAdmin,addMyProfile)

noteRoute.get("/my-profile/:userId",isSameUserOrAdmin,getMyProfile)
noteRoute.put("/my-profile/:userId",isSameUserOrAdmin,updateMyProfile)



module.exports=noteRoute;