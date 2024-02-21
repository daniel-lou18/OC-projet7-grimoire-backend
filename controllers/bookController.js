const Book = require("../models/bookModel");

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err });
  }
};

exports.getBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);
    res.status(200).json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err });
  }
};
