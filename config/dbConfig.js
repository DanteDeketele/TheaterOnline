// dbConfig.js

const mysql = require('mysql2');

const dbConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'v4H5D4U8IYec0IcYJMeA',
  database: 'theateronlineapi', // Adjust the database name as needed
});

module.exports = dbConnection;
