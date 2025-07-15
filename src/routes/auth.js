const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const {
  validateSignupData,
  validateEditProfileData,
} = require("../utils/validation.js");

authRouter.post("/signup", async (req, res) => {
  try {
    // 1. Extract from request body
    const { firstName, lastName, emailId, password, skills, photoUrl, about } =
      req.body;

    // 2. Validate request
    validateSignupData(req);

    // 3. Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    // console.log(passwordHash);

    // 4. Create new user
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      skills,
      photoUrl,
      about,
    });

    // 5. Save to DB
    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
  httpOnly: true,                 // ✅ security best practice
  secure: true,                   // ✅ required on Render
  sameSite: "None",               // ✅ since frontend/backend are cross-origin
  expires: new Date(Date.now() + 8 * 3600000), // ✅ 8 hrs
});

    res.json({ message: "User Added Successfully!", data: savedUser });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
  httpOnly: true,                 // ✅ security best practice
  secure: true,                   // ✅ required on Render
  sameSite: "None",               // ✅ since frontend/backend are cross-origin
  expires: new Date(Date.now() + 8 * 3600000), // ✅ 8 hrs
});

      res.send("Login successfull!!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  expires: new Date(Date.now()), // expire instantly
}).send("Logout successful!");

});
module.exports = authRouter;
