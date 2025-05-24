const express = require("express");
const connectDB = require('./config/database.js');
const User = require("./models/user.js");
const app = express();

app.use(express.json());

app.post("/signup",async(req,res) =>{
    //Creating a new instance of user model
    const user = new User(req.body);
    //this will save the user
    try {
        await user.save();    
        res.send("User Added Successfully!")
    } catch (error) {
        res.status(400).send("Error saving the user: " + error.message);
    }
});

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