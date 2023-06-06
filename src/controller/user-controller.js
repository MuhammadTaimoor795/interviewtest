require("dotenv").config();
const User = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { success, errorResponse } = require("../utils/constants");
const registerUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(409).json({ error: "Username already exists" });
      }

      let encryptpassword = await bcrypt.hash(password, 10);
      const user = new User({ username, password: encryptpassword });
      await user.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      return res.status(500).json(errorResponse(error.message, res.statusCode));
    }
    // if (user) {
    //   return res
    //     .status(200)
    //     .json(
    //       success(
    //         `Signup Successfull And Verification Email is Send to your email `,
    //         res.statusCode
    //       )
    //     );
    // }
  } catch (error) {
    if (error.status === undefined) {
      error.status = 500;
    }
    return res
      .status(error.status)
      .json(errorResponse(error.message, error.status));
  }
};

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    const compare = bcrypt.compareSync(password, user.password);

    if (!user) {
      return res
        .status(401)
        .json(
          errorResponse("User with this name Already Exist", res.statusCode)
        );
    }
    if (!compare) {
      res
        .status(401)
        .json(errorResponse("Password doesn't match", res.statusCode));
    }

    const token = await jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "30m",
      }
    );

    if (token) {
      return res
        .status(200)
        .json(success({ accessToken: token }, res.statusCode));
    }
  } catch (error) {
    return res.status(500).json(errorResponse(error.message, res.statusCode));
  }
};
module.exports = {
  registerUser,
  loginUser,
};
