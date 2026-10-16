import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    unique: true,
  },

  balance:{
    type: Number,
  },
  role: {
    type: String,
    required: true,
    index: true,
  },

  updated_at: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Compound index if you commonly filter by role and sort by updated_at
userSchema.index({
  role: 1,
  updated_at: -1,
});

export const User = mongoose.model("Users", userSchema);