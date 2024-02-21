const bcrypt = require("bcrypt");
const User = require("../models/userModel");

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash });
    console.log(user);
    res.status(201).json({ message: "L'utilisateur a été créé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user === null)
      res.status(401).json({ message: "Email ou mot de passe incorrect" });
    else {
      const passwordIsValid = await bcrypt.compare(password, user.password);
      if (passwordIsValid)
        res.status(200).json({ userId: user._id, token: "TOKEN" });
      else res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ err });
  }
};
