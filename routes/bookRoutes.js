const express = require("express");
const bookController = require("../controllers/bookController");
const { auth } = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const router = express.Router();

router
  .route("/")
  .get(bookController.getAllBooks)
  .post(auth, multer, bookController.addBook);

router.route("/:bookId").get(bookController.getBook);

router.route("/:bookId/rating").post(bookController.addRating);

router.route("/bestrating").get(bookController.getBestBooks);

module.exports = router;
