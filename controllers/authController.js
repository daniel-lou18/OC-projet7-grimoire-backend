const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const { sendError, sendAppError } = require("../utils/sendAppError");

exports.signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash });
    console.log(user);
    res.status(201).json({ message: "L'utilisateur a été créé" });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendAppError(
        "Veuillez saisir votre email ou mot de passe",
        400,
        next
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return sendAppError("Email ou mot de passe incorrect", 403, next);
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (passwordIsValid) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });
      res.status(200).json({ userId: user._id, token });
    } else {
      return sendAppError("Email ou mot de passe incorrect", 403, next);
    }
  } catch (err) {
    next(err);
  }
};
