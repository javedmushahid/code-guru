const express = require('express')
const multer = require('multer');
const { isSignedIn, isValidToken, isSameUserOrAdmin } = require('./../middleware/index');
const { addMyProfile, getMyProfile, updateMyProfile, getAllMyProfile, filterProfiles } = require('../controllers/myProfile');
const { memoryStorage } = require("multer");
const path = require("path");
const myprofileRoute=express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads"); 
  },
  filename: (req, file, cb) => {
    // console.log(file);
    cb(null, Date.now()+path.extname(file.originalname)); 
  },
});

const upload = multer({ storage });

myprofileRoute.post(
  '/my-profile/:userId',
  isSameUserOrAdmin,
  upload.fields([
    { name: 'profilePicture', maxCount: 1 },
  ]),
  addMyProfile
);

myprofileRoute.get("/get-profile/:userId",isSameUserOrAdmin,getMyProfile)
myprofileRoute.get("/filter/:userId/",isSameUserOrAdmin,filterProfiles)
myprofileRoute.get("/get-all/:userId",isSameUserOrAdmin,getAllMyProfile)
myprofileRoute.put("/update-profile/:userId",isSameUserOrAdmin,updateMyProfile)



module.exports=myprofileRoute;