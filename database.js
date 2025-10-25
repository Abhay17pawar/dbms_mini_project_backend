const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'WJ28@krhps',
  database: 'dbms_mini_project',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

function query(sql, params, callback) {
  return pool.query(sql, params, callback);
}

module.exports = { pool, query };
