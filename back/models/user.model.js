import mongoose from "mongoose";

const userShema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female"],
  },
  profilePicture: {
    type: String,
    default: "",
  },
});

const User = mongoose.model("User", userShema);

export default User;
