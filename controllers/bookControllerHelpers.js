const Book = require("../models/bookModel");
const { sendAppError } = require("../utils/sendError");

exports.updateWithoutImage = async function (req, res, next) {
  const result = await verifyUserId(req, next);
  if (!result) return;

  const { bookId, userId } = result;

  const bookData = req.body;
  const updatedBook = await Book.findByIdAndUpdate(
    bookId,
    {
      $set: { ...bookData, userId },
    },
    { runValidators: true, new: true }
  );
  console.log(updatedBook);
  res.status(200).json(updatedBook);
};

exports.updateWithImage = async function (req, res, next) {
  const result = await verifyUserId(req, next);
  if (!result) return;

  const { bookId, userId } = result;
  const bookData = JSON.parse(req.body.book);
  delete bookData.userId;
  const updatedBook = await Book.findByIdAndUpdate(
    bookId,
    {
      $set: {
        ...bookData,
        userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      },
    },
    { runValidators: true, new: true }
  );
  console.log(updatedBook);
  res.status(200).json(updatedBook);
};

async function verifyUserId(req, next) {
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
  return { bookId, userId: authUserId };
}
