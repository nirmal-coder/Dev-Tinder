const express = require("express");
const authUser = require("../middlewares/auth");
const User = require("../models/userModal");
const ConnectionRequest = require("../models/connectionRequest");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:userId",
  authUser,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;
      const { user } = req;

      const validStatus = ["interested", "ignored"];
      const isValidStatus = validStatus.includes(status);

      if (!isValidStatus) throw new Error(status + " is not a valid Status!");

      const isToUserValid = await User.findById(toUserId);
      if (!isToUserValid) throw new Error("To user is not a valid user!");

      const isRequestDoneBefore = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (isRequestDoneBefore) {
        throw new Error("The request already done!");
      }

      const data = await new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      }).save();

      const message =
        status === "interested"
          ? `${user.firstName} successfully sent a connection request to ${isToUserValid.firstName}.`
          : `${user.firstName} was ${status} the ${isToUserValid.firstName}.`;

      res.json({
        data,
        message: message,
      });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  authUser,
  async (req, res) => {
    // first check if status and request Id is valid
    //  check if the toUserId is login user , status is interested , request id is the same in params

    try {
      const { status, requestId } = req.params;
      const loginUser = req.user;
      const allowedFeilds = ["accepted", "rejected"];
      const isValid = allowedFeilds.includes(status);
      if (!isValid) throw new Error("Status Feilds was not valid!");

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loginUser._id,
        status: "interested",
      });

      if (!connectionRequest) throw new Error("Request was not Found!");

      connectionRequest.status = "accepted";

      const data = await connectionRequest.save();

      res.json({
        data,
        message: loginUser.firstName + " was accepted the Request!",
      });
    } catch (error) {
      res.status(404).send("Error : " + error.message);
    }
  }
);

module.exports = requestRouter;
