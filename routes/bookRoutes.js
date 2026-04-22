const express = require("express");
const router = express.Router();
const controller = require("../controllers/bookController");

router.get("/", controller.getAllBooks);

router.get("/:id", controller.getBookById);

router.post("/", controller.addBook);

router.post("/user-status", controller.addUserBookStatus);

router.get("/user-status/:user_id/:status", controller.getUserBooksByStatus);

module.exports = router;