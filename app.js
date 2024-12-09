const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Set up middleware to parse POST request data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (HTML, CSS, JS) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// MySQL database connection
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,  // Use the service name 'mysql' from Docker Compose
  user: process.env.MYSQL_USER,  // 'nodejs_user'
  password: process.env.MYSQL_PASSWORD, // 'admin'
  database: process.env.MYSQL_DATABASE // 'nodejs_app'
});

// Test MySQL connection
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as ID ' + db.threadId);
});

// Serve the index.html form when accessing the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle POST request to store user data in the database
app.post('/submit', (req, res) => {
  const { name, email } = req.body;

  // Insert the new user into the MySQL database
  db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err, result) => {
    if (err) {
      console.error('Error inserting data: ', err);
      return res.status(500).send('Error saving data to the database.');
    }

    // Send confirmation message
    res.send(`
      <html>
        <head>
          <title>Success</title>
        </head>
        <body>
          <h1>Thank you, ${name}!</h1>
          <p>You have been recognized, and your information has been stored in the database.</p>
          <a href="/">Go back</a>
        </body>
      </html>
    `);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

