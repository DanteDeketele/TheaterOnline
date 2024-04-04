// server.js

const express = require('express');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/user', userRoutes);
// Add other routes here

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
