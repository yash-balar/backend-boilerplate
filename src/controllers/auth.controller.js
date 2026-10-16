import { User } from "../models/auth.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Employee } from "../models/user.model.js";

export const registerController = async (req, res) => {
  try {
    const { email, username, password, role } = req.body;

    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(409).json({ message: "User already registered" });
    }
    const numberLength = 10;
    const newPassword = bcrypt.hashSync(password, numberLength);

    console.log("newPassword::::::::::", newPassword);
    const newUser = await User.create({
      email,
      username,
      password: newPassword,
      role,
    });

    console.log("newUser:::::", newUser);
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      },
    );

    res.status(200).json({
      message: "User registered successfully",
      user: newUser,
      token: token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "User registered failed", error: error });
  }
};

export const loginCntroller = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).json({ message: "Missing email and password" });
    }
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid email and password" });
    }

    const isPasswordValid = bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email and password" });
    }

    console.log("existingUser:::::::", existingUser);
    const token = jwt.sign(
      {
        userId: existingUser._id,
        role: existingUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      },
    );

    res.status(200).json({
      message: "User Login successfully",
      user: existingUser,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({ message: "User Login failed", error: error });
  }
};
