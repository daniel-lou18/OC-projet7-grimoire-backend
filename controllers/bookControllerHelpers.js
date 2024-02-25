const Book = require("../models/bookModel");

exports.updateWithoutImage = async function (req, res, next) {
  const { bookId } = req.params;
  const bookData = req.body;
  const updatedBook = await Book.findByIdAndUpdate(
    bookId,
    {
      $set: { ...bookData },
    },
    { runValidators: true, new: true }
  );
  console.log(updatedBook);
  res.status(200).json(updatedBook);
};

exports.updateWithImage = async function (req, res, next) {
  const { bookId } = req.params;
  const bookData = JSON.parse(req.body.book);
  delete bookData.userId;
  const updatedBook = await Book.findByIdAndUpdate(
    bookId,
    {
      $set: {
        ...bookData,
        userId: req.auth.userId,
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
