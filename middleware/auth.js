const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decodedToken;
    req.auth = { userId };
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ err });
  }
};
