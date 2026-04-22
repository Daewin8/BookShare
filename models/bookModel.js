const db = require("./db");

exports.getAllBooks = async () => {
    const result = await db.query(`
        SELECT 
            books.id,
            books.title,
            books.description,
            books.author_id,
            authors.name AS author
        FROM books
        LEFT JOIN authors ON books.author_id = authors.id
    `);

    return result.rows;
};

exports.getBookById = async (id) => {
  const result = await db.query(`
        SELECT 
            books.id,
            books.title,
            books.description,
            authors.name AS author,
            authors.biography AS author_bio
        FROM books
        LEFT JOIN authors ON books.author_id = authors.id
        WHERE books.id = $1
    `, [id]);

  return result.rows[0];
};

exports.addBook = async (book) => {
    const {
        title,
        description,
        author_id
    } = book;

    const result = await db.query(`
        INSERT INTO books (title, description, author_id)
        VALUES ($1, $2, $3)
        RETURNING *
    `, [
        title,
        description,
        author_id
    ]);

    return result.rows[0];
};

exports.addUserBookStatus = async (user_id, book_id, status) => {
  const result = await db.query(
    `INSERT INTO user_books (user_id, book_id, status)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, book_id)
         DO UPDATE SET status = EXCLUDED.status
         RETURNING *`,
    [user_id, book_id, status]
  );

  return result.rows[0];
};

exports.getUserBooksByStatus = async (user_id, status) => {
  const result = await db.query(
    `SELECT books.*, user_books.status
         FROM books
         JOIN user_books ON books.id = user_books.book_id
         WHERE user_books.user_id = $1 AND user_books.status = $2`,
    [user_id, status]
  );

  return result.rows;
};