const express = require("express");
const router = express.Router();
const controller = require("../controllers/bookController");

// -------------------- BOOKS --------------------
router.get("/", controller.getAllBooks);
router.post("/", controller.addBook);

// -------------------- USER STATUS --------------------
router.post("/user-status", controller.setUserBookStatus);

router.get("/user-status/book/:user_id/:book_id", controller.getUserBookStatus);

router.get("/user-status/status/:user_id/:status", controller.getUserBooksByStatus);

router.delete("/user-status", controller.removeUserBookStatus);

// -------------------- BOOK CRUD BY ID --------------------
router.get("/:id", controller.getBookById);
router.put("/:id", controller.updateBook);
router.delete("/:id", controller.deleteBook);

module.exports = router;