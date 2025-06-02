const express = require("express");
const connectDB = require('./config/database.js');
const User = require("./models/user.js");
const app = express();
const {validateSignupData} = require("./utils/validation.js");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cookieParser());
const {userAuth} = require("../src/middleware/auth.js");

app.post("/signup", async (req, res) => {
    try {
        // 1. Extract from request body
        const { firstName, lastName, emailId, password } = req.body;

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
            password: passwordHash
        });

        // 5. Save to DB
        await user.save();
        res.send("User Added Successfully!");
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
});
app.post("/login", async (req, res) => {
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

//when we login a cookie is passed it contains jwt token and then at the time of giving response to user for 
//next operation or task it checks or verify if token is okay or correct.. otherwise it wont pass the data/response.
app.get("/profile",async(req,res) =>{
    try {
    const user =  req.user

    res.send(user);
    } catch (error) {
         res.status(400).send("Error: " + error.message);
    }
})

app.get("/user", async(req,res) =>{
    const userEmail = req.body.emailId;
    try{
        const user = await User.find({emailId:userEmail});
        if(!user){
             res.status(400).send("User not found!!")
        }
        if(user.length === 0){
            res.status(404).send("User not found");
        }else {
            res.send(user);
        }
    }catch(err){
        res.status(400).send("Something went wrong")
    }
});

//feed api to get all the users from the database 
app.get("/feed",async(req,res) =>{
    try {
        const user = await User.find({});
        res.send(user);
    } catch (err) {
        res.status(400).send("Something went wrong")
    }
});

app.delete("/user",async(req,res) =>{
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted!!")
    } catch (err) {
        res.status(400).send("Something went wrong")
    }
});

app.patch("/user",async(req,res) =>{
    const userId = req.body.userId;
    const data = req.body;
    try {
        const ALLOWED_UPDATES = ["about","gender","age","skills"]; //this includes only those data sets in which we can change the values.
        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k)
        )
        if(!isUpdateAllowed){
            throw new Error("Update not allowed")
        }
        if(data?.skills.length > 10){
            throw new Error("Skills can't be more than 10")
        }
        const user = await User.findByIdAndUpdate(userId,data);
        res.send("User updated!!")
    } catch (err) {
        res.status(400).send("Something went wrong")
    }
})

connectDB()
.then(() =>{
    console.log("Database connection established!!")
    app.listen(7777,() =>{
        console.log("Server is successfully listening to the port 7777..!!");
    })
})
.catch((err) =>{
    console.log("Database cannot be connected!!")
}); 