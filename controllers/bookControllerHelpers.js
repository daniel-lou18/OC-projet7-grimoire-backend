const fs = require("fs").promises;
const Book = require("../models/bookModel");
const { sendAppError } = require("../utils/sendError");

exports.verifyUserId = async function (req, next) {
  const { bookId } = req.params;
  const authUserId = req.auth.userId;
  const book = await Book.findById(bookId);
  if (book.userId !== authUserId) {
    sendAppError(
      "Vous n'êtes pas autorisé à modifier le livre car votre user ID ne correspond pas à l'user ID associé au livre",
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
  console.log(path);
  path && (await fs.unlink(path));
};
