const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userProfileSchema = new Schema(
  {
    name: { type: String, required: true },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    email: { type: String, required: true },
    bio: { type: String, required: true },
    profilePicture: { type: String },
    country: { type: String },
  },
  { timestamps: true }
);

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

module.exports = UserProfile;
