const express = require("express");
const connectDB = require("./config/database");
const { User } = require("./models/userModal");
const bcrypt = require("bcrypt");
const { isStrongPassword } = require("validator");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authUser = require("./middlewares/auth");
const app = express();

const port = process.env.PORT || 1207;
app.use(express.json());
app.use(cookieParser());

//  Sign in user

app.post("/signin", async (req, res) => {
  const { firstName, lastName, emailId, password, age, gender } = req.body;
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
      res.send("Signup Successfully!");
    }
  } catch (error) {
    res.send(error.message);
  }
});

// /Login user

app.post("/login", async (req, res) => {
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

app.get("/profile", authUser, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    if (!user) throw new Error("User Not Found");
    else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

connectDB().then(() => {
  console.log("Database connected successfully....");
  app.listen(port, () => {
    console.log(`Server is running on port ${port}.......`);
  });
});

app.use("/", (req, res) => {
  res.send("Welcome DevTinder Backend");
});
