const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {

  try {

    // get token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No Token, Authorization Denied"
      });
    }

    const token = authHeader.split(" ")[1];

    // verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // store user
    req.user = decoded;

    next();

  } catch (error) {

    res.status(401).json({
      message: "Invalid Token"
    });
  }
};

module.exports = protect;