const Book = require("../models/bookModel");
const { sendAppError } = require("../utils/sendAppError");
const {
  updateWithoutImage,
  updateWithImage,
} = require("./bookControllerHelpers");

exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    next(err);
  }
};

exports.getBestBooks = async (req, res, next) => {
  try {
    const bestBooks = await Book.find().sort({ averageRating: -1 }).limit(3);
    res.status(200).json(bestBooks);
  } catch (err) {
    next(err);
  }
};

exports.getBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);
    res.status(200).json(book);
  } catch (err) {
    next(err);
  }
};

exports.addBook = async (req, res, next) => {
  try {
    if (!req.file)
      return sendAppError("Il est obligatoire d'ajouter une image", 400, next);
    const bookData = JSON.parse(req.body.book);
    delete bookData.userId;
    const newBook = new Book({
      ...bookData,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    });
    const response = await newBook.save();
    console.log(response);
    res.status(201).json({ message: "Le livre a été créé" });
  } catch (err) {
    next(err);
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    if (!req.file) {
      await updateWithoutImage(req, res, next);
    } else {
      await updateWithImage(req, res, next);
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    await Book.findByIdAndDelete(bookId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.addRating = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const { userId, rating } = req.body;
    const book = await Book.findById(bookId);
    book.ratings.push({ userId, grade: rating });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
};
