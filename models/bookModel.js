const db = require("./db");

exports.getAllBooks = async () => {
    const result = await db.query(`
        SELECT id, title, description, author_name AS author
        FROM books
    `);

    return result.rows;
};

exports.getBookById = async (id) => {
    const result = await db.query(`
        SELECT id, title, description, author_name AS author
        FROM books
        WHERE id = $1
    `, [id]);

    return result.rows[0];
};

exports.setUserBookStatus = async (user_id, book_id, status) => {
    const result = await db.query(`
        INSERT INTO user_books (user_id, book_id, status)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, book_id)
        DO UPDATE SET status = EXCLUDED.status
        RETURNING *
    `, [user_id, book_id, status]);

    return result.rows[0];
};

exports.getUserBooksByStatus = async (user_id, status) => {
    const result = await db.query(`
        SELECT 
            b.id,
            b.title,
            b.description,
            b.author_name AS author,
            ub.status
        FROM user_books ub
        INNER JOIN books b ON b.id = ub.book_id
        WHERE ub.user_id = $1 
        AND ub.status = $2
        ORDER BY ub.created_at DESC
    `, [user_id, status]);

    return result.rows || [];
};

exports.getUserBookStatus = async (user_id, book_id) => {
    const result = await db.query(`
        SELECT status
        FROM user_books
        WHERE user_id = $1 AND book_id = $2
    `, [user_id, book_id]);

    return result.rows[0];
};

exports.removeUserBookStatus = async (user_id, book_id) => {
    const result = await db.query(`
        DELETE FROM user_books
        WHERE user_id = $1 AND book_id = $2
        RETURNING *
    `, [user_id, book_id]);

    return result.rows[0];
};

exports.addFavorite = async (user_id, book_id) => {
    const result = await db.query(`
        INSERT INTO favorites (user_id, book_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        RETURNING *
    `, [user_id, book_id]);

    return result.rows[0];
};

exports.removeFavorite = async (user_id, book_id) => {
    await db.query(`
        DELETE FROM favorites
        WHERE user_id = $1 AND book_id = $2
    `, [user_id, book_id]);
};

exports.getFavorites = async (user_id) => {
    const result = await db.query(`
        SELECT b.*
        FROM books b
        JOIN favorites f ON b.id = f.book_id
        WHERE f.user_id = $1
    `, [user_id]);

    return result.rows;
};