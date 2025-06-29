const jwt = require("jsonwebtoken");
const User = require("../models/userModal");

const authUser = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) throw new Error("Token not Valid");
  const { _id } = await jwt.verify(token, process.env.JWT_KEY);
  console.log(_id);
  const user = await User.findById(_id);
  if (!user) throw new Error("user not Found!");
  req.user = user;
  next();
};

module.exports = authUser;
