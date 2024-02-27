const express = require("express");
const bookController = require("../controllers/bookController");
const { auth } = require("../middleware/auth");
const { initMulter, uploadImage } = require("../middleware/uploadImage");
const router = express.Router();

router
  .route("/")
  .get(bookController.getAllBooks)
  .post(auth, initMulter, uploadImage, bookController.addBook);

router.route("/bestrating").get(bookController.getBestBooks);

router.route("/:bookId/rating").post(auth, bookController.addRating);

router
  .route("/:bookId")
  .get(bookController.getBook)
  .put(auth, initMulter, uploadImage, bookController.updateBook)
  .delete(auth, bookController.deleteBook);

module.exports = router;
