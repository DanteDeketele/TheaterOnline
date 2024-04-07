// dbConfig.js

const mysql = require('mysql2');

// TODO: HIDE THIS INFO IN ENV
const dbConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'v4H5D4U8IYec0IcYJMeA', //Yes this is not safe, but its a test database at the moment
  database: 'theateronlineapi', // Adjust the database name as needed
});

module.exports = dbConnection;
