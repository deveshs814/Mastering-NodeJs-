const express = require("express");
const connectDB = require('./config/database.js');
const User = require("./models/user.js");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("../src/routes/auth.js");
const profileRouter  = require("../src/routes/profile.js");
const requestRouter = require("../src/routes/requests.js");
const userRouter = require("../src/routes/user.js")

app.use(express.json());
app.use(cookieParser());
app.use("/user", userRouter);
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
//when we login a cookie is passed it contains jwt token and then at the time of giving response to user for 
//next operation or task it checks or verify if token is okay or correct.. otherwise it wont pass the data/response.


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