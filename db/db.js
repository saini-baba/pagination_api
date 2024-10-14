let mysql = require("mysql2");
let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employees",
  port: 3000,
});
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: ", err.stack);
    return;
  }
  console.log("Connected to the MySQL database as ID: ", connection.threadId);
});

module.exports = connection;
