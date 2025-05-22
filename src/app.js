const express  = require("express");

const app = express();

const { adminAuth } = require("./middleware/auth.js")

app.use("/admin",adminAuth); 

app.get('/admin/getAllData', (req,res) =>{
    res.send("All data is received")
})
app.get('/admin/deleteAllData',  adminAuth, (req,res) =>{ //this is more better way to pas the middleware in between the route and
    //(req,res) cycle.
    res.send("All data is received")
})


app.listen(3000,(req,res) =>{
    console.log("Server is running at the port 3000");
})