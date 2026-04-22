const Book = require("../models/bookModel");

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.getAllBooks();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.getBookById(id);

        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }

        res.json(book);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addBook = async (req, res) => {
  try {
    const { title, description, author_id } = req.body;

    if (!title) {
      return res.status(400).json({
        error: "title is required"
      });
    }

    const book = await Book.addBook({
      title,
      description,
      author_id
    });

    res.json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.addUserBookStatus = async (req, res) => {
  try {
    const { user_id, book_id, status } = req.body;

    const validStatuses = ["reading", "read", "want_to_read"];

    if (!user_id || !book_id || !validStatuses.includes(status)) {
      return res.status(400).json({
        error: "user_id, book_id, and valid status are required"
      });
    }

    const result = await Book.addUserBookStatus(user_id, book_id, status);
    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserBooksByStatus = async (req, res) => {
  try {
    const { user_id, status } = req.params;

    const books = await Book.getUserBooksByStatus(user_id, status);
    res.json(books);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};