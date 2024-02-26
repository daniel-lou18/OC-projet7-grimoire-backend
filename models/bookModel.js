const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "Le champ 'userId' est obligatoire"],
  },
  title: {
    type: String,
    required: [true, "Le champ 'titre' est obligatoire"],
  },
  author: {
    type: String,
    required: [true, "Le champ 'author' est obligatoire"],
  },
  imageUrl: {
    type: String,
    required: [true, "Le champ 'imageUrl' est obligatoire"],
  },
  year: {
    type: Number,
    required: [true, "Le champ 'year' est obligatoire"],
  },
  genre: {
    type: String,
    default: "Roman",
  },
  ratings: [
    {
      userId: {
        type: String,
        required: [true, "Le champ 'userId' est obligatoire pour un rating"],
      },
      grade: {
        type: Number,
        default: 3,
        min: 1,
        max: 5,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  averageRating: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

bookSchema.pre("save", function (next) {
  if (this.isModified("ratings")) {
    this.averageRating = (
      this.ratings.reduce((acc, curr) => acc + curr.grade, 0) /
      this.ratings.length
    ).toFixed(0);
  }
  next();
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
