const express = require("express");
const connectDB = require('./config/database.js');
const app = express();

connectDB()
.then(() =>{
    console.log("Database connection established!!")
})
.catch((err) =>{
    console.log("Database cannot be connected!!")
});