const express = require("express");
const userRouter  = express.Router();

const {userAuth} = require('../middleware/auth.js');
const ConnectionRequest = require("../models/connectionRequest.js")
const USER_DATA = "firstName lastName age gender about skills";

userRouter.get("/user/requests/received",userAuth,async(req,res) ={
    try {
        const loggedInUser = req.user;

        const connectionRequests  = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status  = 'interested',
        }).populate(
            "fromUserId",
             USER_DATA,
        )
        res.json({
            message:"Data fetched successfully!",
        })
    } catch (error) {
        res.statusCode(400).send("Error: " + error.message);
    }
})

userRouter.get("/user/connections" , userAuth,async(req,res)=>{
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {toUserId: loggedInUser._id,status:"accepted" },
                {fromUserId:loggedInUser._id,status:"accepted" },
            ]
        }).populate("fromUserId" , USER_DATA).populate("toUserId" , USER_DATA);
        // console.log(connectionRequests);

        const data = connectionRequests.map((row) =>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });
    } catch (error) {
        res.status(400).send({message: error.message});
    }
})
module.exports = userRouter;