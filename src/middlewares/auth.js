const jwt = require("jsonwebtoken");

const authUser = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) throw new Error("Token not Valid");
  const user = await jwt.verify(token, process.env.JWT_KEY);
  req.userId = user._id;
  next();
};

module.exports = authUser;
