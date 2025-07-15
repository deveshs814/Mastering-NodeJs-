const express = require("express");
const userRouter = express.Router();
const user = require("../models/user.js");
const { userAuth } = require("../middleware/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");
const mongoose = require("mongoose");
const USER_DATA = "_id firstName lastName emailId photoUrl";

// Route to get received connection requests
userRouter.get("/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
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
      ],
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

    // 1. Get all connection requests where current user is either sender or receiver
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    // 2. Build a Set of userIds to exclude from feed
    const excludeUsers = new Set();
    excludeUsers.add(loggedInUser._id.toString()); // always exclude self

    connectionRequests.forEach((req) => {
      excludeUsers.add(req.fromUserId.toString());
      excludeUsers.add(req.toUserId.toString());
    });

    // 3. Fetch users NOT in the exclude list
    const users = await User.find({
      _id: { $nin: [...excludeUsers] },
    })
      .select(USER_DATA)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      page,
      limit,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = userRouter;
