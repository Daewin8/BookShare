const db = require("../models/db");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const hash = await bcrypt.hash(password, 10);

        const result = await db.query(
            `INSERT INTO users (username, password_hash)
             VALUES ($1, $2)
             RETURNING id, username`,
            [username, hash]
        );

        res.json(result.rows[0]);

    } catch (err) {
        if (err.code === "23505") {
            return res.status(400).json({ error: "Username already exists" });
        }

        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const result = await db.query(
            `SELECT * FROM users WHERE username = $1`,
            [username]
        );

        const user = result.rows[0];

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const valid = await bcrypt.compare(password, user.password_hash);

        if (!valid) {
            return res.status(400).json({ error: "Invalid password" });
        }

        res.json({ id: user.id, username: user.username });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};