// userController.js

const e = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, deleteUserById, editUserById, getAll, getUserById, getUserByEmail, getUserByUsernameOrEmail, getUsersCreatedPerWeek, getPassword,
  promoteToAdmin, demoteFromAdmin, getAdmins } = require('../models/userModel');

  exports.loginUser = async (req, res) => {
    try {
        // Extract username/email and password from request body
        const { username, password } = req.body;

        // Check if username/email and password are provided
        if (!username) {
            throw new Error('username/email is required.');
        }
        if (!password) {
            throw new Error('Password is required.');
        }

        // Fetch user from the database by username/email
        const user = await getUserByUsernameOrEmail(username);

        // Check if user exists
        if (!user) {
            throw new Error('User not found.');
        }
        
        const passwordHash = await getPassword(user.id);

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, passwordHash);

        if (!isPasswordValid) {
            throw new Error('Invalid password.');
        }

        // Store user information in the session
        req.session.userId = user.id;

        // Send success response with JWT token
        res.status(200).json({ status: 'success', message:"Logged in." });
    } catch (err) {
        // Send error response
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.createUser = async (req, res) => {
  try {
    const userId = await createUser(req.body);
    res.status(201).json({ status: 'success', data: { userId } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
    const userId = req.params.userId;
    try {
      await deleteUserById(userId);
      res.status(204).json({ status: 'success', message: 'User deleted successfully.' });
    } catch (err) {
      res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.editUser = async (req, res) => {
    const userId = req.params.userId;
    const userData = req.body;
    try {
        await editUserById(userId, userData);
        res.status(200).json({ status: 'success', message: 'User updated successfully.' });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
  try {
      // Extract pagination parameters from the request query or set default values
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
      const search = req.query.search ? req.query.search : '';

      // Call getAll function with pagination parameters
      const data = await getAll(page, pageSize, search);

      res.status(200).json({ status: 'success', data });
  } catch (err) {
      res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  const userId = req.url.split('/').pop();
  try {
    const user = await getUserById(userId);
    res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
}

exports.getUsersCreatedPerWeek = async (req, res) => {
  try {
    const data = await getUsersCreatedPerWeek();
    res.status(200).json({ status: 'success', data });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
}

exports.promoteToAdmin = async (req, res) => {
  const userId = req.url.split('/').pop();
  try {
    await promoteToAdmin(userId);
    res.status(200).json({ status: 'success', message: 'User promoted to admin successfully.' });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
}

exports.demoteFromAdmin = async (req, res) => {
  const userId = req.url.split('/').pop();
  try {
    await demoteFromAdmin(userId);
    res.status(200).json({ status: 'success', message: 'User demoted from admin successfully.' });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
}

exports.getAdmins = async (req, res) => {
  try {
    const data = await getAdmins();
    res.status(200).json({ status: 'success', data });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
}