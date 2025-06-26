const express = require("express");
const connectDB = require("./config/database");
const { User } = require("./models/userModal");
const bcrypt = require("bcrypt");
const { isStrongPassword } = require("validator");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authUser = require("./middlewares/auth");
const app = express();

const port = 1207;

app.listen(port, () => {
  console.log(`Server is running on port ${port}.......`);
});

app.use("/", (req, res) => {
  res.send("Welcome DevTinder Backend");
});
