// userModel.js

const dbConnection = require('../config/dbConfig');
const { generateIdCode, isIdCode } = require('../utils/idCodeGenerator');
const bcrypt = require('bcrypt');

// Function to create a user
const createUser = async (userData) => {
    // Check if required fields are provided
    if (!userData.username) {
        throw new Error('Username is a required field.');
    }

    if (!userData.email) {
        throw new Error('Email is a required field.');
    }

    if (!userData.password) {
        throw new Error('Password is a required field.');
    }
  
    // Check if email format is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format.');
    }
    // Check if email is already registered
    const existingEmail = await dbConnection.promise().query(
        'SELECT * FROM users WHERE email = ?',
        [userData.email]
    );
    if (existingEmail[0].length > 0){
        throw new Error('An account with this email already exists.');
    }

    

    // Check if username is already taken
    const existingUsername = await dbConnection.promise().query(
        'SELECT * FROM users WHERE username = ?',
        [userData.username]
    );
    if (existingUsername[0].length > 0){
        throw new Error('Username is already taken.');
    }
    // Check if username contains only lowercase letters and numbers
    const usernameRegex = /^[a-z0-9]+$/;
    if (!usernameRegex.test(userData.username)) {
        throw new Error('Username can only contain lowercase letters and numbers.');
    }


    // Check if user ID is already taken (assuming user ID is unique)
    let userId;
    let existingUserId;
    do {
        userId = generateIdCode();
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
    if (!isIdCode(userId)) {
        throw new Error('Invalid user ID.');
    }

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

const getAll = async (page, pageSize, search) => {
    try {
        // Calculate offset based on page number and page size
        const offset = (page - 1) * pageSize;

        // Define the base SQL query
        let sqlQuery = 'SELECT user_id AS id, username, full_name, email, register_date FROM users';

        // Define the WHERE clause to filter based on search
        let whereClause = '';

        // Define the ORDER BY clause based on whether search is empty or not
        let orderByClause = '';

        // Define the parameters for the query
        let params = [];

        // Check if search is not empty
        if (search) {
            // Construct the WHERE clause to filter based on search
            whereClause = ' WHERE user_id LIKE ? OR username LIKE ? OR full_name LIKE ? OR email LIKE ?';
            
            // Add the search parameters to the params array
            params = [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`];

            // Construct the ORDER BY clause to order by relevance to the search term
            orderByClause = ' ORDER BY CASE ' +
                            'WHEN user_id LIKE ? THEN 0 ' +
                            'WHEN username LIKE ? THEN 1 ' +
                            'WHEN full_name LIKE ? THEN 2 ' +
                            'WHEN email LIKE ? THEN 3 ' +
                            'ELSE 4 END';

            // Add the search parameters again for ordering
            params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
        } else {
            // If search is empty, order by register date
            orderByClause = ' ORDER BY register_date DESC';
        }

        // Append the WHERE and ORDER BY clauses to the SQL query
        sqlQuery += whereClause + orderByClause;

        // Append the LIMIT and OFFSET clauses to implement pagination
        sqlQuery += ' LIMIT ? OFFSET ?';

        // Add pagination parameters to the params array
        params.push(pageSize, offset);

        // Execute the SQL query
        const [userRows, fields] = await dbConnection.promise().query(sqlQuery, params);

        // Query to get total count of users
        const [countRows, _] = await dbConnection.promise().query('SELECT COUNT(*) AS user_count FROM users' + whereClause, params);

        // Extract total count from the countRows result
        const totalCount = countRows[0].user_count;

        return {
            users: userRows,
            totalCount: totalCount,
            paging: {
                total: Math.ceil(totalCount / pageSize),
                current: page,
                size: pageSize
            }
        };
    } catch (err) {
        throw new Error(err.message);
    }
};


const getUserById = async (userId) => {
    try {
        const [rows, fields] = await dbConnection.promise().query(
        'SELECT user_id id, username, full_name, email, register_date FROM users WHERE user_id = ?',
        [userId]
        );
        if (rows.length === 0) {
        throw new Error('User not found.');
        }
        return rows[0];
    } catch (err) {
        throw new Error(err.message);
    }
};
  
  module.exports = { createUser, deleteUserById, editUserById, getAll, getUserById };