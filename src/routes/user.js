const express = require("express");
const userRouter = express.Router();
const user = require("../models/user.js")
const { userAuth } = require('../middleware/auth.js');
const ConnectionRequest = require("../models/connectionRequest.js");
const mongoose = require("mongoose");
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

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;

        const skip = (page - 1) * limit;

        // Step 1: Get connection requests involving the logged-in user
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId");

        // Step 2: Build a Set of user IDs to hide (including self)
        const hideUsersFromFeed = new Set();

        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        // Always hide the logged-in user
        hideUsersFromFeed.add(loggedInUser._id.toString());

        // Step 3: Query only users NOT in hideUsersFromFeed
        const users = await User.find({
            _id: {
                $nin: Array.from(hideUsersFromFeed).map(id => new mongoose.Types.ObjectId(id))
            }
        })
        .select(USER_DATA)
        .skip(skip)
        .limit(limit);

        res.status(200).json({
            page,
            limit,
            count: users.length,
            users
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


module.exports = userRouter;
