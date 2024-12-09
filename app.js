const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',       // Change this if using Dockerized MySQL or external DB
  user: 'nodejs_user',     // Replace with actual MySQL user
  password: 'admin',       // Replace with actual password
  database: 'nodejs_app'   // Replace with actual database name
});

// Test MySQL connection
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as ID ' + db.threadId);
});

// Middleware to parse JSON bodies in POST requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // Middleware to parse form data

// Serve static HTML files (form)
app.use(express.static(path.join(__dirname, 'public')));

// Basic route to confirm server is running
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Endpoint to fetch users from the MySQL database
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      res.status(500).send('Error fetching users from the database');
    } else {
      res.json(results);
    }
  });
});

// Endpoint to create a new user (POST request from form submission)
app.post('/users', (req, res) => {
  const { name, email } = req.body;

  // Input validation
  if (!name || !email) {
    return res.status(400).send('Name and email are required');
  }

  // Validate email format (basic check)
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailPattern.test(email)) {
    return res.status(400).send('Invalid email format');
  }

  // Insert the new user into the database using a prepared statement
  const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
  db.query(query, [name, email], (err, result) => {
    if (err) {
      console.error('Error creating user: ', err);
      res.status(500).send('Error creating user');
    } else {
      res.status(201).send(`User created with ID: ${result.insertId}`);
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
