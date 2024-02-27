const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "le champ 'email' est obligatoire"],
    unique: true,
    validate: [validator.isEmail, "L'adresse mail n'est pas valide"],
  },
  password: {
    type: String,
    required: [true, "Le champ 'password' est obligatoire"],
    minlength: 8,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.plugin(uniqueValidator);

userSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 12);
  this.password = hash;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
