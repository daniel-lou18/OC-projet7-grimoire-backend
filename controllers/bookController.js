const Book = require("../models/bookModel");

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    next(err);
  }
};

exports.getBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);
    res.status(200).json(book);
  } catch (err) {
    next(err);
  }
};

exports.addBook = async (req, res) => {
  try {
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
