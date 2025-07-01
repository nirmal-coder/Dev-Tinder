const express = require("express");
const User = require("../models/userModal");
const authUser = require("../middlewares/auth");
const { patchValidation } = require("../utils/validation");
const profileRouter = express.Router();

// Get Api to view profile

profileRouter.get("/profile/view", authUser, async (req, res) => {
  try {
    const { user } = req;
    if (!user) throw new Error("User not Found!");
    else {
      res.json({
        message: "user send successfully!",
        data: user,
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Update profile Api

profileRouter.patch("/profile/edit", authUser, async (req, res) => {
  try {
    const isValidData = patchValidation(req);

    if (!isValidData) throw new Error("Enter a valid data!!!");
    const userId = req.user._id;
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { ...req.body },
      { returnDocument: "after", runValidators: true }
    );

    res.send("updated successfully!!!");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = profileRouter;
