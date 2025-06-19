const jwt = require("jsonwebtoken");
const User = require("../models/user.js")

//read the token;
//validate the token;
//find the user;
const userAuth = async(req,res,next) =>{
   try {
      const {token} = req.cookies;
   if(!token){
      return res.status(401).send("Please login!!")
   }

   const decodedMsg = await jwt.verify(token, "DEV@Tinder@123");
   const {_id} = decodedMsg;

   const user = await User.findById(_id);
   if(!user){
      throw new Error("User not found!");
   }
   req.user = user;
   next();
   } catch (err) {
      res.status(400).send("Error : ", err.message)
   }
};

module.exports = {userAuth};