const express = require("express");
const authUser = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/userModal");

const userRouter = express.Router();

const DATA_FEILDS = ["firstName", "lastName", "skills", "about"];

userRouter.get("/user/request", authUser, async (req, res) => {
  try {
    const loginUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loginUser._id,
      status: "interested",
    }).populate("fromUserId", DATA_FEILDS);

    const data = connectionRequest.map((each) => each.fromUserId);

    res.json({
      data,
      message: "All connection request sended!",
    });
  } catch (error) {
    res.send("Error : " + error.message);
  }
});

userRouter.get("/user/connections", authUser, async (req, res) => {
  try {
    const loginUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loginUser._id,
          status: "accepted",
        },
        {
          toUserId: loginUser._id,
          status: "accepted",
        },
      ],
    }).populate(["fromUserId", "toUserId"], DATA_FEILDS);

    if (!connections) throw new Error("No Connections Found!");

    const data = connections.map((each) => {
      if (each.fromUserId._id.toString() === loginUser._id.toString()) {
        return each.toUserId;
      }
      return each.fromUserId;
    });

    res.json({
      data,
      message: "All connection request recieved successfully!",
    });
  } catch (error) {
    res.status(400).send("Error : " + error);
  }
});

userRouter.get("/user/feed", authUser, async (req, res) => {
  try {
    const loginUser = req.user._id;
    const page = req.query.page || 1;
    let limit = req.query.limit || 10;

    const skip = (page - 1) * limit;
    limit = limit > 50 ? 50 : limit;

    const connectionUser = await ConnectionRequest.find({
      $or: [{ fromUserId: loginUser._id }, { toUserId: loginUser._id }],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();

    connectionUser.forEach((each) => {
      hideUserFromFeed.add(each.fromUserId);
      hideUserFromFeed.add(each.toUserId);
    });

    const feed = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loginUser._id } },
      ],
    })
      .select(DATA_FEILDS)
      .skip(skip)
      .limit(limit);

    res.json({
      data: feed,
      message: "Feed sended successfully!",
    });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

module.exports = userRouter;
