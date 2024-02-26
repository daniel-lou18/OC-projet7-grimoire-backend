const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "le champ 'email' est obligatoire"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Le champ 'password' est obligatoire"],
    select: false,
  },
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);

module.exports = User;
