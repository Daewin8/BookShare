const db = require("../models/db");

// -------------------- BOOKS --------------------
exports.getAllBooks = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT id, title, description, author_name AS author
             FROM books
             ORDER BY id DESC`
        );

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getBookById = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT id, title, description, author_name AS author
             FROM books
             WHERE id = $1`,
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Book not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addBook = async (req, res) => {
    try {
        const { title, description, author_name } = req.body;

        if (!title || title.trim() === "") {
            return res.status(400).json({ error: "Title is required" });
        }

        const result = await db.query(
            `INSERT INTO books (title, description, author_name)
             VALUES ($1, $2, $3)
             RETURNING id, title, description, author_name AS author`,
            [
                title.trim(),
                description || "",
                author_name || "Unknown Author"
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const { title, description, author_name } = req.body;

        if (!title || title.trim() === "") {
            return res.status(400).json({ error: "Title is required" });
        }

        const result = await db.query(
            `UPDATE books
             SET title = $1,
                 description = $2,
                 author_name = $3
             WHERE id = $4
             RETURNING id, title, description, author_name AS author`,
            [
                title.trim(),
                description || "",
                author_name || "Unknown Author",
                req.params.id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Book not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const result = await db.query(
            `DELETE FROM books
             WHERE id = $1
             RETURNING id, title`,
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Book not found" });
        }

        res.json({
            message: "Book deleted",
            book: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// -------------------- USER STATUS --------------------
exports.setUserBookStatus = async (req, res) => {
    try {
        const { user_id, book_id, status } = req.body;

        const validStatuses = ["reading", "read", "want_to_read"];

        if (!user_id || !book_id || !validStatuses.includes(status)) {
            return res.status(400).json({
                error: "user_id, book_id, and a valid status are required"
            });
        }

        const result = await db.query(
            `INSERT INTO user_books (user_id, book_id, status)
             VALUES ($1, $2, $3)
             ON CONFLICT (user_id, book_id)
             DO UPDATE SET status = EXCLUDED.status
             RETURNING *`,
            [user_id, book_id, status]
        );

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserBookStatus = async (req, res) => {
    try {
        const { user_id, book_id } = req.params;

        const result = await db.query(
            `SELECT status
             FROM user_books
             WHERE user_id = $1 AND book_id = $2`,
            [user_id, book_id]
        );

        res.json(result.rows[0] || { status: null });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserBooksByStatus = async (req, res) => {
    try {
        const { user_id, status } = req.params;

        const result = await db.query(
            `SELECT 
                b.id,
                b.title,
                b.description,
                b.author_name AS author,
                ub.status
             FROM books b
             JOIN user_books ub ON b.id = ub.book_id
             WHERE ub.user_id = $1 AND ub.status = $2
             ORDER BY ub.created_at DESC`,
            [user_id, status]
        );

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.removeUserBookStatus = async (req, res) => {
    try {
        const { user_id, book_id } = req.body;

        if (!user_id || !book_id) {
            return res.status(400).json({
                error: "user_id and book_id are required"
            });
        }

        await db.query(
            `DELETE FROM user_books
             WHERE user_id = $1 AND book_id = $2`,
            [user_id, book_id]
        );

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};