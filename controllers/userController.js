// userController.js

const e = require('express');
const { createUser, deleteUserById, editUserById, getAll } = require('../models/userModel');

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