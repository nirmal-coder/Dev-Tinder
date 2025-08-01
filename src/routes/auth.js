const express = require("express");
const bcrypt = require("bcrypt");
const { isStrongPassword } = require("validator");
const authUser = require("../middlewares/auth");
const User = require("../models/userModal");

const authRouter = express.Router();

const DATA_FEILDS = ["firstName", "lastName", "skills", "about"];

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

      const SignIndata = await user.save();
      const data = {
        firstName: SignIndata.firstName,
        lastname: SignIndata.lastName,
        skills: SignIndata.skills,
        about: SignIndata?.about,
        age: SignIndata?.gender,
        gender: SignIndata?.gender,
        photo: SignIndata?.photo,
      };
      res.json({
        data: data,
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
    const user = await User.findOne({ emailId });
    if (!user) throw new Error("Invalid credentials!");
    const isValidPassword = await user.isPasswordValid(password);
    if (!isValidPassword) throw new Error("Invalid Password!");
    const token = await user.getJwt(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Todo : change to true in production and sameSite : none
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const data = {
      firstName: user.firstName,
      lastname: user.lastName,
      skills: user.skills,
      about: user?.about,
      age: user?.gender,
      gender: user?.gender,
      photo: user?.photo,
    };

    res.json({
      data: data,
      message: "login Successfully😁",
    });
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
