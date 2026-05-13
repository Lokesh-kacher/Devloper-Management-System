const nodemailer = require("nodemailer");

const sendOTPEmail = async (email, otp) => {

  // Create transporter here (lazily) so it always reads the correct env vars
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Developer Management System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Login OTP - Developer Management System",
    text: `Your OTP for login is ${otp}. It will expire in 5 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Login Verification</h2>
        <p>Hello,</p>
        <p>You recently tried to log in to the <strong>Developer Management System</strong>. Please use the following OTP to complete your login:</p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #4a90e2; border-radius: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This OTP is valid for <strong>5 minutes</strong>. If you did not request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888; text-align: center;">Developer Management System &copy; 2026</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`✅ OTP email sent successfully to ${email}`);
};

module.exports = { sendOTPEmail };
