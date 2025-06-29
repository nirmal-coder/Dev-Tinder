const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/user");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");

const app = express();

app.use(express.json());
app.use(cookieParser());

// ROUTERS

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// Connection to Db and server
const port = process.env.PORT || 1207;
connectDB().then(() => {
  console.log("Database connected successfully....");
  app.listen(port, () => {
    console.log(`Server is running on port ${port}.......`);
  });
});
