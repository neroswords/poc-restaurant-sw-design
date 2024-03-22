const mysql = require('mysql2');

var connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'timetracking',
    database: 'vacCenter'
});

module.exports = connection;