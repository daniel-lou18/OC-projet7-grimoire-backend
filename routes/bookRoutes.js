const express = require("express");
const bookController = require("../controllers/bookController");
const { auth } = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const router = express.Router();

router
  .route("/")
  .get(bookController.getAllBooks)
  .post(auth, multer, bookController.addBook);

router.route("/bestrating").get(bookController.getBestBooks);

router.route("/:bookId").get(bookController.getBook);

router.route("/:bookId/rating").post(auth, bookController.addRating);

module.exports = router;
