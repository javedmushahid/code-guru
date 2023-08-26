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
const User=require("../models/UserModel")

const Note=require("../models/NoteModel")



const addNote = async (req, res) => {
    try {
      const { content } = req.body;
      const { userId } = req.params;
  
      // Create new note instance
      const newNote = new Note({
        content,
        user: userId
      });
  
      // Save the new note to the database
      const savedNote = await newNote.save();
  
      // Send success response
      res.status(201).json({ success: true, note: savedNote });
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).json({ success: false, error: "Server Error" });
    }
  };
  