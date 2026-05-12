const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {

  try {

    // get token
    const token = req.headers.authorization;

    // check token
    if (!token) {

      return res.status(401).json({
        message: "No Token, Authorization Denied"
      });
    }

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