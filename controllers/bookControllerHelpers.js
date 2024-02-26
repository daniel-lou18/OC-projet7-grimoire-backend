const fs = require("fs").promises;
const Book = require("../models/bookModel");
const { sendAppError } = require("../utils/sendError");

exports.verifyUserId = async function (req, next) {
  const { bookId } = req.params;
  const authUserId = req.auth.userId;
  const book = await Book.findById(bookId);
  if (book.userId !== authUserId) {
    sendAppError(
      "User ID actuel ne correspond pas à l'user ID du livre",
      403,
      next
    );
    return false;
  }
  return book;
};

exports.deleteImage = async function (book) {
  const index = book.imageUrl?.indexOf("images/");
  const path = index !== -1 ? book.imageUrl.substring(index) : null;
  path && (await fs.unlink(path));
};
