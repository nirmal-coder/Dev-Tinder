const validator = require("validator");

const signUpValidation = (req) => {
  if (!validator.isEmail(req.body.emailId)) {
    throw new Error("Email is not a valid format!");
  } else if (!validator.isStrongPassword(req.body.password)) {
    throw new Error(
      "Enter a strong password -> minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1"
    );
  }
};

module.exports = {
  signUpValidation,
};
