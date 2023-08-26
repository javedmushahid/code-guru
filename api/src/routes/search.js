const express = require("express");
const { isSameUserOrAdmin } = require("../middleware");
const { search } = require("../controllers/searchUser");

const searchRoute = express.Router();

searchRoute.get("/search/:userId", isSameUserOrAdmin, search);

 
module.exports = searchRoute;
 