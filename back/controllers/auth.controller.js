import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Password don`t match" });
    }

    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    // /https://avatar.iran.liara.run

    const boyPicture = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlPicture = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullName,
      username,
      password: hashedPass,
      gender,
      profilePicture: gender === "male" ? boyPicture : girlPicture,
    });
    if (newUser) {
      // Generate JWT token
      generateToken(newUser._id, res);
      await newUser.save();
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }

    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "invalid username or password" });
    }
    generateToken(user._id, res);
    res.status(200).json(user);
  } catch (error) {
    console.log("error in login controller", error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};

export const logout = (req,res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};
