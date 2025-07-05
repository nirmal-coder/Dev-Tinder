const express = require("express");
const bcrypt = require("bcrypt");
const { isStrongPassword } = require("validator");
const authUser = require("../middlewares/auth");
const User = require("../models/userModal");

const authRouter = express.Router();

// /SIGN IN API
authRouter.post("/signin", async (req, res) => {
  const { firstName, lastName, emailId, password, age, gender } = req.body;
  console.log(req);
  try {
    const isValidPassword = isStrongPassword(password);
    if (!isValidPassword) throw new Error("Enter a Strong password!");
    else {
      const hashPassword = await bcrypt.hash(password, 10);
      const user = new User({
        firstName,
        lastName,
        emailId,
        password: hashPassword,
        age,
        gender,
      });

      await user.save();
      res.json({
        data: user,
        message: "signin Success😁",
      });
    }
  } catch (error) {
    res.send(error.message);
  }
});

// Login API

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) throw new Error("Invalid credentials!");
    const isValidPassword = await user.isPasswordValid(password);
    if (!isValidPassword) throw new Error("Invalid Password!");
    const token = await user.getJwt(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.send("login Success😁");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

authRouter.post("/logout", authUser, async (req, res) => {
  try {
    res.cookie("token", null, { maxAge: 0 });
    res.send("loged out");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = authRouter;
