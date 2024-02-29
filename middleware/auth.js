const { sendAppError, sendError } = require("../utils/sendError");
const { promisifiedVerify } = require("../utils/promisifyJwt");

exports.auth = async (req, _, next) => {
  try {
    const token =
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer") &&
      req.headers.authorization.split(" ")[1];
    if (!token)
      return sendAppError(
        "Vous n'êtes pas authentifié : JWT token manquant",
        401,
        next
      );
    const decodedToken = await promisifiedVerify(token, process.env.JWT_SECRET);
    const { userId } = decodedToken;
    req.auth = { userId };
    next();
  } catch (err) {
    console.error(err);
    sendError(err, 401, next);
  }
};
