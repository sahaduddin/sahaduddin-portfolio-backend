const mariadb = require('mariadb');
const env = require('./env');
const logger = require('./logger');

const pool = mariadb.createPool({
  host: env.db.host,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  connectionLimit: env.db.connectionLimit
});

// Test connection on database load
pool.getConnection()
  .then(conn => {
    logger.info(`[Database] Pool established on host ${env.db.host}:${env.db.database} — Pool OK`);
    conn.release();
  })
  .catch(err => {
    logger.warn(`[Database] Pool initialized but startup test failed: ${err.message}`);
  });

async function query(sql, params) {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(sql, params);
    return res;
  } catch (err) {
    logger.error(`[Database] Query exception: ${sql}`, err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

module.exports = { pool, query };
