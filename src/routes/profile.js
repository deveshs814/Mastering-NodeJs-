const express = require("express");
const validateEditProfileData = require("../utils/validation.js")
const {userAuth} = require("../middleware/auth");

const profileRouter = express.Router();
profileRouter.get("/profile",async(req,res) =>{
    try {
    const user =  req.user;
    res.send(user);
    } catch (error) {
         res.status(400).send("Error: " + error.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid edit request!");
        }

        const loggedInUser = req.user;
        console.log(loggedInUser);
        
        Object.keys(req.body).forEach((key) =>(loggedInUser[key] = req.body[key]));
        await loggedInUser.save();

        res.send("Your profile is updated successfully!");
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
});

module.exports  = profileRouter;