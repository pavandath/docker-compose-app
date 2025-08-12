const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const port = 3000;

// MySQL connection
let connection;

async function initDB() {
  connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'db',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'password',
    database: process.env.MYSQL_DATABASE || 'testdb'
  });

  // Create table if not exists
  await connection.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      content VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

app.get('/', async (req, res) => {
  try {
    // Insert a sample message
    await connection.query("INSERT INTO messages (content) VALUES ('Hello from existing images!')");
    
    // Get all messages
    const [rows] = await connection.query("SELECT * FROM messages");
    
    res.json({
      status: 'success',
      messages: rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Initialize and start
initDB().then(() => {
  app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
  });
}).catch(err => {
  console.error('Failed to initialize DB:', err);
  process.exit(1);
});