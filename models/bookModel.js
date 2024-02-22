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
    },
    {
      grade: {
        type: Number,
        required: [true, "Le champ 'grade' est obligatoire pour un rating"],
        min: 0,
        max: 5,
      },
    },
  ],
  averageRating: {
    type: Number,
  },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
