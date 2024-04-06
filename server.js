// server.js

const express = require('express');
const path = require('path');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(express.json());

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Set up static file serving
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/user', userRoutes);

app.get('/admin/dashboard', (req, res) => {
  res.render('admin/dashboard');
});

app.get('/admin/users', (req, res) => {
  res.render('admin/users');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
