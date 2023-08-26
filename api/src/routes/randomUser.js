const express = require('express')
const { isSignedIn, isValidToken, isSameUserOrAdmin } = require('./../middleware/index');
const { getRandomUser } = require('../controllers/randomUser');

const randomUserRoute=express.Router();


randomUserRoute.get("/random-user/:userId",isSameUserOrAdmin,getRandomUser)


module.exports=randomUserRoute;