const Chat = require("../models/chatModel");
const User = require("../models/UserModel");
const { loggerUtil } = require("../utils/logger");
const { OK, BAD_REQUEST, NOT_FOUND } = require("../utils/statusCode");

const accessChat = async (req, res) => {
  const { userId } = req.params;
  const { user_id } = req.body;
  const user = await User.findOne({ userId });

  if (!userId) {
    return res.status(NOT_FOUND).json({
      message: "user not found",
    });
  }

  if (!user_id) {
    return res.status(NOT_FOUND).json({
      message: "user_id not send in body to find",
    });
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: user._id } } }, 
      { users: { $elemMatch: { $eq: user_id } } },
    ],
  })
    .populate("users", "-password -confirmPassword -otp")
    .populate("latestMessage");
    
    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name profilePicture email",
    });
    
    if (isChat.length > 0) {
      res.status(OK).json({ message: "Chat Found", chat: isChat });
    } else {
      let chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [user._id, user_id],
      };

    try {
      const createChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createChat._id }).populate(
        "users",
        "-password -confirmPassword -otp"
      );
      

      res.status(OK).json({ message: "Chat Results", chats: fullChat });
    } catch (error) {
      console.log(error);
    }
  }
};

const fetchChats = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ userId });

    const result = await Chat.find({
      users: { $elemMatch: { $eq: user._id } },
    })
      .populate({
        path: "users",
        select: "-password -confirmPassword -otp",
      })
      .populate({
        path: "groupAdmin",
        select: "-password -confirmPassword -otp",
      })
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name profilePicture email",
        });
        res.status(OK).json({ message: "Chats Retrieved", chats: results });
      });
  } catch (error) {
    console.log(error);
  }
};

const creatGroupChat = async (req, res) => {
  const { userId } = req.params;
  console.log("Received userId:", userId);

  const user = await User.findOne({ userId });
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  let users = req.body.users;
  console.log("user from group selecting",user)
  if (users.length < 2) {
    return res.status(BAD_REQUEST).json({
      message: "More than 2 users are required to form a group chat",
    });
  }
  users.push(user._id);
  console.log("Users to add in group chat:", users);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: user._id,
    });

    const fullChat = await Chat.findOne({ _id: groupChat._id })
      .populate({
        path: "users",
        select: "-password -confirmPassword -otp",
      })
      .populate({
        path: "groupAdmin",
        select: "-password -confirmPassword -otp",
      });

      console.log("Group chat created:", fullChat);

    return res.status(OK).json({
      message: "Group Chats",
      chats: fullChat,
    });
  } catch (error) {
    console.log(error);
  }
};

const renameGroupChat = async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password -confirmPassword -otp")
    .populate("groupAdmin", "-password -confirmPassword -otp");

  if (!updatedChat) {
    res.status(404);
    console.log("CHAT NOT FOUND");
  } else {
    res.status(OK).json({ message: "RENAMED Group Chat", chats: updatedChat });
  }
};

const addToGroup = async (req, res) => {
    const { chatId, user_id } = req.body;
  
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(NOT_FOUND).json({ message: "Chat not found" });
    }
  
    const isUserAlreadyInGroup = chat.users.some((userId) => userId.toString() === user_id);
    if (isUserAlreadyInGroup) {
      return res.status(BAD_REQUEST).json({ message: "User is already in the group" });
    }
  
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: user_id },
      },
      { new: true }
    )
      .populate("users", "-password -confirmPassword -otp")
      .populate("groupAdmin", "-password -confirmPassword -otp");
  
    if (!added) {
      return res.status(NOT_FOUND).json({
        message: "Chat not found",
      });
    } else {
      return res.status(OK).json({
        status: OK,
        message: "Added to group",
        chat: added,
      });
    }
  };
  
 
const removeFromGroup = async (req, res) => {
  const { chatId, user_id } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: user_id },
    },
    { new: true }
  )
    .populate("users", "-password -confirmPassword -otp")
    .populate("groupAdmin", "-password -confirmPassword -otp");

  if (!removed) {
    return res.status(NOT_FOUND).json({
      message: "chat not found",
    });
  } else {
    return res.status(OK).json({
      status: OK,
      message: `removed from group ${user_id}`,
      chat: removed,
    });
  }
};
module.exports = { accessChat, fetchChats, creatGroupChat, renameGroupChat,addToGroup,removeFromGroup };
