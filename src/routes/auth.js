const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user.js")
const { validateSignupData, validateEditProfileData } = require("../utils/validation.js");


authRouter.post("/signup", async (req, res) => {
    try {
        // 1. Extract from request body
        const { firstName, lastName, emailId, password,skills,photoUrl,about } = req.body;

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
            about
        });

        // 5. Save to DB
        await user.save();
        res.send("User Added Successfully!");
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
});
authRouter.post("/login", async (req, res) => {
    try {
        const {emailId,password} = (req.body);

        const user = await User.findOne({emailId:emailId})
        if(!user){
            throw new Error("Invalid credentials")
        }
        const isPasswordValid = await user.validatePassword(password)
        if(isPasswordValid){

            const token = await user.getJWT();
            res.cookie("token",token,{expires: new Date(Date.now() + 8 * 3600000)});
            res.send("Login successfull!!")
        }else {
            throw new Error("Invalid credentials")
        }
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
});

authRouter.post("/logout",async(req,res) =>{
    res.cookie("token",null,{
        expiresIn:new Date(Date.now()),
    }).send("Logout successful!")
})
module.exports = authRouter;