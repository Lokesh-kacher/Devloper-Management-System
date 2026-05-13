const User = require("../models/User");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");


const { sendOTPEmail } = require("../config/mailer");


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

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save OTP to user
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP via email
    try {
      await sendOTPEmail(user.email, otp);
    } catch (emailError) {
      console.warn("Email sending failed, but you can see the OTP below:");
    }

    // ALWAYS log to console for development testing
    console.log("-------------------------------");
    console.log(`TESTING OTP FOR ${user.email}: ${otp}`);
    console.log("-------------------------------");

    res.status(200).json({
      message: "OTP sent to your email",
      email: user.email 
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};


// VERIFY OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if OTP matches and is not expired
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Clear OTP fields after successful verification
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

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
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  registerUser,
  loginUser,
  verifyOTP
};