const express = require("express");
const bookController = require("../controllers/bookController");
const router = express.Router();

router.route("/").get(bookController.getAllBooks);

router.route("/:bookId").get(bookController.getBook);

module.exports = router;
