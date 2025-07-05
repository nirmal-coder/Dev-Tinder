const { Schema, model } = require("mongoose");
const { isStrongPassword, isEmail, isLowercase } = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      minLength: [3, "Firstname should be atleast 3 characters"],
      maxLength: [50, "Firstname length should be lessthan 50 characters"],
      required: [true, "FirstName is Required!"],
    },
    lastName: {
      type: String,
      maxLength: 50,
    },
    emailId: {
      type: String,
      required: [true, "Email Id is Required!"],
      lowercase: true,
      validate(email) {
        if (!isEmail(email)) {
          throw new Error("Enter a Valid Email Id!");
        }
      },
      unique: [true, "Email exists!"],
    },
    password: {
      type: String,
      required: [true, "password is required!"],
      validate(password) {
        if (!isStrongPassword(password)) {
          throw new Error("Enter a strong password!");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      // required: [true, "Age is Required"],
    },
    skills: {
      type: [String],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: "gender is not Valid!",
      },
      // required: [true, "Gender is Required!"],
    },
    about: {
      type: String,
      maxLength: 300,
    },
  },
  { timestamps: true }
);

userSchema.methods.getJwt = async function (userId) {
  const token = await jwt.sign({ _id: userId }, process.env.JWT_KEY, {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.isPasswordValid = function (userInputPassword) {
  const isvalid = bcrypt.compare(userInputPassword, this.password);

  return isvalid;
};
const User = model("User", userSchema);

module.exports = User;
