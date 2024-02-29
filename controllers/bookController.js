const Book = require("../models/bookModel");
const { sendAppError } = require("../utils/sendError");
const { deleteImage, verifyUserId } = require("./bookControllerHelpers");

exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find();
    if (!books || books.length === 0)
      return sendAppError("Nous n'avons pas retrouvé de livres", 404, next);
    res.status(200).json(books);
  } catch (err) {
    next(err);
  }
};

exports.getBestBooks = async (req, res, next) => {
  try {
    const bestBooks = await Book.find().sort({ averageRating: -1 }).limit(3);
    if (!bestBooks || bestBooks.length === 0)
      return sendAppError(
        "Impossible de récupérer les livres les mieux notés",
        404,
        next
      );
    res.status(200).json(bestBooks);
  } catch (err) {
    next(err);
  }
};

exports.getBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);
    if (!book)
      return sendAppError("Le livre que vous demandez n'existe pas", 400, next);
    res.status(200).json(book);
  } catch (err) {
    next(err);
  }
};

exports.addBook = async (req, res, next) => {
  try {
    console.log(req.file);
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
    const { bookId } = req.params;
    let book = await verifyUserId(bookId, req, next);
    if (!book) return;

    const bookData = req.file
      ? {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        }
      : { ...req.body };
    delete bookData.userId;
    req.file && (await deleteImage(book, next));

    await Book.updateOne(
      { _id: bookId },
      { ...bookData, _id: bookId },
      { runValidators: true }
    );
    res.status(200).json({ message: "Le livre a été mis à jour" });
  } catch (err) {
    next(err);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const book = await verifyUserId(bookId, req, next);
    if (!book) return;
    await deleteImage(book, next);
    await Book.deleteOne({ _id: bookId });
    res.status(200).json({ message: "Le livre a été supprimé" });
  } catch (err) {
    next(err);
  }
};

exports.addRating = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const { userId, rating } = req.body;
    const book = await Book.findById(bookId);
    if (!book)
      return sendAppError(
        "Le livre que vous voulez noter n'existe pas",
        400,
        next
      );
    if (req.auth.userId !== userId)
      return sendAppError(
        "Vous ne pouvez pas créer une note avec l'ID d'un autre utilisateur",
        403,
        next
      );
    if (book.ratings.find((rating) => rating.userId === userId))
      return sendAppError(
        "Vous ne pouvez pas noter le même livre plusieurs fois",
        401,
        next
      );
    book.ratings.push({ userId, grade: rating });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
};
