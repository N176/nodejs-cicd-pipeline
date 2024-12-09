const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

<<<<<<< HEAD
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
=======
// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',       // Change this if using Dockerized MySQL or external DB
  user: 'nodejs_user',     // Replace with actual MySQL user
  password: 'admin',       // Replace with actual password
  database: 'nodejs_app'   // Replace with actual database name
>>>>>>> 938e83b40999f6566c18dcd2e08038421180631d
});

// Test MySQL connection
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as ID ' + db.threadId);
});

<<<<<<< HEAD
// Serve the index.html form when accessing the root route
=======
// Middleware to parse JSON bodies in POST requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // Middleware to parse form data

// Serve static HTML files (form)
app.use(express.static(path.join(__dirname, 'public')));

// Basic route to confirm server is running
>>>>>>> 938e83b40999f6566c18dcd2e08038421180631d
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

<<<<<<< HEAD
=======
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

>>>>>>> 938e83b40999f6566c18dcd2e08038421180631d
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

