const express = require("express");
const { isSameUserOrAdmin } = require("../middleware");
const { accessChat, fetchChats,creatGroupChat, renameGroupChat, removeFromGroup, addToGroup } = require("../controllers/chatController");

const chatRoute = express.Router();

chatRoute.post("/chat/:userId", isSameUserOrAdmin, accessChat);
chatRoute.get("/fetch-chat/:userId", isSameUserOrAdmin, fetchChats);
chatRoute.post("/group-chat/:userId", isSameUserOrAdmin, creatGroupChat);
chatRoute.put("/rename-group-chat/:userId", isSameUserOrAdmin, renameGroupChat);
chatRoute.delete("/remove-from-group/:userId", isSameUserOrAdmin, removeFromGroup);
chatRoute.put("/add-to-group/:userId", isSameUserOrAdmin, addToGroup);

 
module.exports = chatRoute;
 