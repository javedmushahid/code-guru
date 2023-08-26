const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    message: { type: String, required: [true, "Please provide your feedback message."] },
    user: { type: Schema.Types.ObjectId, ref: "User", required: [true, "Please add userId."] },
  },{ timestamps: true });
  
  const Feedback = mongoose.model("Feedback", feedbackSchema);
  
  module.exports = Feedback;
  