// userModel.js

const dbConnection = require('../config/dbConfig');
const Filter = require('bad-words');
const filter = new Filter();

// Function to generate hex code ID
const generateHexCode = (length) => {
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Function to create a user
const createUser = async (userData) => {
    // Check if required fields are provided
    if (!userData.username) {
        throw new Error('Username is a required field.');
    }

    if (!userData.email) {
        throw new Error('Email is a required field.');
    }
  
    // Check if email format is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format.');
    }

    

    // Check if username is already taken
    const existingUsername = await dbConnection.promise().query(
        'SELECT count(*) FROM users WHERE username = ?',
        [userData.username]
    );
    if (existingUsername[0] != 0) {
        throw new Error('Username is already taken.');
    }
    if (filter.isProfane(userData.username)) {
        throw new Error('Username contains prohibited words.');
    }



    // Check if user ID is already taken (assuming user ID is unique)
    let userId;
    let existingUserId;
    do {
        userId = generateHexCode(8); // Generate 8 character hex code for user ID
        existingUserId = await dbConnection.promise().query(
            'SELECT * FROM users WHERE user_id = ?',
            [userId]
        );
    } while (existingUserId[0].length > 0);


    // Check if password meets minimum requirements
    if (userData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long.');
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10); // Use salt rounds of 10
  
    try {
        const userId = generateHexCode(8); // Generate 8 character hex code for user ID
        const [rows, fields] = await dbConnection.promise().execute(
            'INSERT INTO users (user_id, username, full_name, email, password, register_date, update_date) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
            [userId, userData.username, userData.fullName, userData.email, hashedPassword]
        );
        return userId;
    } catch (err) {
        throw new Error(err.message);
    }
  };
  

const deleteUserById = async (userId) => {
    try {
        const [rows, fields] = await dbConnection.promise().execute(
        'DELETE FROM users WHERE user_id = ?',
        [userId]
        );
    } catch (err) {
        throw new Error(err.message);
    }
};

const editUserById = async (userId, userData) => {
    try {
        const [rows, fields] = await dbConnection.promise().execute(
        'UPDATE users SET username = ?, full_name = ?, email = ?, password = ?, update_date = NOW() WHERE user_id = ?',
        [userData.username, userData.fullName, userData.email, userData.password, userId]
        );
    } catch (err) {
        throw new Error(err.message);
    }
};
  
  module.exports = { createUser, deleteUserById, editUserById };