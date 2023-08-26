const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userId: { type: Number, required: [true, "Please add userId."] },
    name: { type: String, },
    email: {
      type: String,
      required: [true, "Please provide an email address."],
      unique: [true, "Email address already registered."],
      trim: true,
    },
    password: {
      type: String,
      // required: [true, "Please provide a password."],
      trim: true,
    },
    confirmPassword: {
      type: String,
      // required: [true, "Please confirm your password."],
      trim: true,
    },
    profilePicture: {
      type: String,
      // required: true,
      default:
        "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png",
    },
    otp: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
