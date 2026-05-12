const User = require("../models/User");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");


// REGISTER
const registerUser = async (req, res) => {

  try {

    const { name, email, password } = req.body;

    // check existing user
    const userExists = await User.findOne({ email });

    if (userExists) {

      return res.status(400).json({
        message: "User Already Exists"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User Registered Successfully",
      user
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};



// LOGIN
const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ email });

    if (!user) {

      return res.status(400).json({
        message: "Invalid Email"
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {

      return res.status(400).json({
        message: "Invalid Password"
      });
    }

    // generate token
    const token = jwt.sign(
      {
        id: user._id
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d"
      }
    );

    res.status(200).json({
      message: "Login Successful",
      token
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};


module.exports = {
  registerUser,
  loginUser
};