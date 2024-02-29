const fs = require("fs").promises;
const Book = require("../models/bookModel");
const { sendAppError } = require("../utils/sendError");

exports.verifyUserId = async function (bookId, req, next) {
  try {
    const authUserId = req.auth.userId;
    const book = await Book.findById(bookId);
    if (book.userId !== authUserId) {
      sendAppError(
        "Vous n'êtes pas autorisé à modifier/supprimer le livre car votre user ID ne correspond pas à l'user ID associé au livre",
        403,
        next
      );
      return false;
    }
    return book;
  } catch (err) {
    next(err);
  }
};

exports.deleteImage = async function (book, next) {
  try {
    const index = book.imageUrl?.indexOf("images/");
    const path = index !== -1 ? book.imageUrl.substring(index) : null;
    console.log(path);
    path && (await fs.unlink(path));
  } catch (err) {
    if (err.code === "ENOENT")
      return console.log("Le fichier que vous voulez supprimer n'existe pas");
    next(err);
  }
};
