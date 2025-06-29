const express = require("express");
const authUser = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

const DATA_FEILDS = ["firstName", "lastName", "skills", "about"];

userRouter.get("/user/request", authUser, async (req, res) => {
  // -> In connectionResquest which as login user Id in toUser
  // -> status should be in interested

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
  // fromUserId equals to login user and status accepted or
  // toUserId equal to login user and status accepted

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

    console.log(connections);

    if (!connections) throw new Error("No Connections Found!");

    const data = connections.map((each) => {
      if (each.fromUserId.toString() === loginUser._id.toString()) {
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

module.exports = userRouter;
