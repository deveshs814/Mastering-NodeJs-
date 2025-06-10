const express = require("express");
const userRouter = express.Router();
const user = require("../models/user.js")
const { userAuth } = require('../middleware/auth.js');
const ConnectionRequest = require("../models/connectionRequest.js");

const USER_DATA = "firstName lastName age gender about skills";

// Route to get received connection requests
userRouter.get("/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested',
        }).populate("fromUserId", USER_DATA);

        res.json({
            message: "Data fetched successfully!",
            requests: connectionRequests,
        });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// Route to get user connections
userRouter.get("/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" },
            ]
        })
        .populate("fromUserId", USER_DATA)
        .populate("toUserId", USER_DATA);

        const connections = connectionRequests.map((row) => {
            return row.fromUserId._id.toString() === loggedInUser._id.toString()
                ? row.toUserId
                : row.fromUserId;
        });

        res.json({
            message: "Connections fetched successfully!",
            connections,
        });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

userRouter.get("/feed",userAuth, async(req,res) =>{
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or:[{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}],
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req) =>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });
        console.log(hideUsersFromFeed);

        const users = await User.find({
            $and:[
                {_id:{$nin:Array.from(hideUsersFromFeed)}},
                {_id: {$ne:loggedInUser._id}},
            ],
        }).select(USER_DATA);

        res.send(users);
    } catch (error) {
        res.status(400).json({message : error.message});
    }
})

module.exports = userRouter;
