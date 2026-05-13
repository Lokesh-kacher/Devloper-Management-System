const express = require("express");

const {
  registerUser,
  loginUser,
  verifyOTP,
  forgotPassword,
  resetPassword
} = require("../controllers/authController");

const router = express.Router();


// routes
router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/verify-otp", verifyOTP);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);


module.exports = router;