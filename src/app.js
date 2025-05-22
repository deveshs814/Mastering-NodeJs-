const express  = require("express");

const app = express();
// you can add these route handlers in array , they will work in same way.
app.get("/user",(req,res,next) =>{ //pls remember these 3 parameters while writing multiple route handlers
    console.log("Handling response 1")
     res.send("1st response") // agr hum is line ko comment krte h to hum dekhenge ki wo next function ko call krega 
     //yani ki dusre route handler ko (cause of next()), or response me niche wala de dega route handler ka response 
     // or agr kuch bhi comment out nhi h to phla wala response hi show krega or sath me error aaega kyunki response 
     // is already fulfilled .
    next()
}, (req,res) =>{
    console.log("Handling response 2")
    res.send("2nd response")
})

app.listen(3000,(req,res) =>{
    console.log("Server is running at the port 3000");
})