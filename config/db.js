// const mariadb = require('mariadb');
const mysql = require('mysql2');  // ✅ ONLY THIS LINE CHANGED
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portfolio',
  connectionLimit: parseInt(process.env.DB_CONN_LIMIT, 10) || 5
});
async function query(sql, params) {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(sql, params);
    return res;
  } finally {
    if (conn) conn.release();
  }
}

module.exports = { pool, query };
