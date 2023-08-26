const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const noteSchema = new Schema({
    content: { type: String, required: [true, "Please add the content for the note."] },
    user: { type: Schema.Types.ObjectId, ref: "User", required: [true, "Please add userId."] },
  },{ timestamps: true });
  
  const Note = mongoose.model("Note", noteSchema);
  
  module.exports = Note;
  