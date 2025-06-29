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

const patchValidation = (req) => {
  const VALID_FIELDS = [
    "age",
    "gender",
    "skills",
    "lastName",
    "firstName",
    "about",
  ];
  const isValidData = Object.keys(req.body).every((v) =>
    VALID_FIELDS.includes(v)
  );

  return isValidData;
};

module.exports = {
  signUpValidation,
  patchValidation,
};
