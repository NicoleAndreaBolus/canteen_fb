const { Pool } = require('pg');

// Uses environment variables for DB authentication
const pool = new Pool();

async function addFeedback({ customer_name, rating, comment, signature, public_key }) {
    const result = await pool.query(
        `INSERT INTO feedbacks (customer_name, rating, comment, signature, public_key)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [customer_name, rating, comment, signature, public_key]
    );
    return result.rows[0];
}

async function getAllFeedback() {
    const result = await pool.query(
        `SELECT * FROM feedbacks ORDER BY created_at DESC`
    );
    return result.rows;
}

module.exports = { addFeedback, getAllFeedback };