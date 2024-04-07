// userMiddleware.js

const { getUserById } = require('../models/userModel');

const fetchUserDetails = async (req, res, next) => {
  try {
    // Fetch user details from the database based on the user ID stored in the session
    const userId = req.session.userId;
    const user = await getUserById(userId); // Replace with your function to fetch user details
    req.user = user; // Attach user details to the request object
    next(); // Move to the next middleware or route handler
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch user details.' });
  }
};

module.exports = { fetchUserDetails };
