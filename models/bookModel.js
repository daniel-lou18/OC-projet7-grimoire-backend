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
    set: function (value) {
      // il faut utiliser 'set' car juste mettre une valeur par défaut ne marche pas quand le formulaire est envoyé sans saisir le genre
      if (value === "") return "Roman";
      else return value;
    },
  },
  ratings: [
    {
      userId: {
        type: String,
        required: [true, "Le champ 'userId' est obligatoire pour un rating"],
      },
      grade: {
        type: Number,
        min: 0,
        max: 5,
        default: 3,
        set: function (value) {
          // valeur par défaut en absence de notation dans le formulaire : 3
          if (value === 0) return 3;
          else return value;
        },
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
    ).toFixed(1);
  }
  next();
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
