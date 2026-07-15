import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'savior_ai',
  waitForConnections: true,
  connectionLimit: 10,
});

// Test DB connection on startup so we get a clear log message
// instead of mysterious failures on first request.
let dbAvailable = false;
(async () => {
  try {
    const conn = await pool.getConnection();
    conn.release();
    dbAvailable = true;
    console.log('✅ MySQL connected successfully to', process.env.DB_NAME || 'savior_ai');
  } catch (err) {
    console.warn('⚠️  MySQL is not available:', err.message);
    console.warn('   The app will still work but scan results will NOT be persisted to the database.');
    console.warn('   To fix: start MySQL and run server/database/schema.sql');
  }
})();

export function isDbAvailable() {
  return dbAvailable;
}
