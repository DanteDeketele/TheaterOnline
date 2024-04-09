// userModel.js

const dbConnection = require('../config/dbConfig');
const bcrypt = require('bcrypt');

const getAll = async () => {
    try {
        const [rows] = await dbConnection.promise().query(
            'SELECT * FROM producer'
        );
        return rows;
    } catch (err) {
        throw new Error(err.message);
    }
};

  
  module.exports = { getAll };