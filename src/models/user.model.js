import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  profileImage: {
    type: String,
    required: true,
  },
});

export const Employee = mongoose.model("Employee", userSchema);
